create extension if not exists pgcrypto;

create table if not exists public.churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  location text,
  denomination text,
  logo_url text,
  primary_color text not null default '#6B46C1',
  owner_id uuid not null references auth.users(id) on delete cascade,
  auto_archive_days integer not null default 90,
  approval_required boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.church_members (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references public.churches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'coordinator', 'member')),
  created_at timestamptz not null default now(),
  unique (church_id, user_id)
);

create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references public.churches(id) on delete cascade,
  author_name text,
  author_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text not null,
  category text not null check (category in ('ziekte', 'familie', 'werk', 'geestelijk_leven', 'algemeen')),
  priority text not null default 'normaal' check (priority in ('urgent', 'normaal', 'laag')),
  visibility text not null default 'openbaar' check (visibility in ('openbaar', 'prive')),
  status text not null default 'open' check (status in ('open', 'in_gebed', 'beantwoord', 'gearchiveerd')),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.prayer_engagements (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.prayer_requests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (request_id, user_id)
);

create table if not exists public.prayer_comments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.prayer_requests(id) on delete cascade,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.prayer_events (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references public.churches(id) on delete cascade,
  title text not null,
  event_date timestamptz not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_church_member(target_church uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.church_members cm
    where cm.church_id = target_church
      and cm.user_id = auth.uid()
  );
$$;

create or replace function public.is_church_leader(target_church uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.church_members cm
    where cm.church_id = target_church
      and cm.user_id = auth.uid()
      and cm.role in ('admin', 'coordinator')
  );
$$;

alter table public.churches enable row level security;
alter table public.church_members enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.prayer_engagements enable row level security;
alter table public.prayer_comments enable row level security;
alter table public.prayer_events enable row level security;

create policy "leaders can manage own church"
on public.churches
for all
using (owner_id = auth.uid() or public.is_church_leader(id))
with check (owner_id = auth.uid() or public.is_church_leader(id));

create policy "members can view church members"
on public.church_members
for select
using (public.is_church_member(church_id));

create policy "leaders can manage church members"
on public.church_members
for all
using (
  public.is_church_leader(church_id)
  or exists (
    select 1 from public.churches c
    where c.id = church_members.church_id
      and c.owner_id = auth.uid()
  )
)
with check (
  public.is_church_leader(church_id)
  or exists (
    select 1 from public.churches c
    where c.id = church_members.church_id
      and c.owner_id = auth.uid()
  )
);

create policy "public can read approved public prayer requests"
on public.prayer_requests
for select
using (visibility = 'openbaar' and approved = true);

create policy "members can read church prayer requests"
on public.prayer_requests
for select
using (public.is_church_member(church_id));

create policy "leaders can manage church prayer requests"
on public.prayer_requests
for all
using (public.is_church_leader(church_id))
with check (public.is_church_leader(church_id));

create policy "public can submit prayer requests"
on public.prayer_requests
for insert
with check (visibility = 'openbaar');

create policy "members can read engagements"
on public.prayer_engagements
for select
using (
  exists (
    select 1
    from public.prayer_requests pr
    where pr.id = request_id
      and (public.is_church_member(pr.church_id) or (pr.visibility = 'openbaar' and pr.approved = true))
  )
);

create policy "authenticated users can pray once"
on public.prayer_engagements
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.prayer_requests pr
    where pr.id = request_id
      and (public.is_church_member(pr.church_id) or (pr.visibility = 'openbaar' and pr.approved = true))
  )
);

create policy "public can read comments on approved public requests"
on public.prayer_comments
for select
using (
  exists (
    select 1 from public.prayer_requests pr
    where pr.id = request_id
      and pr.visibility = 'openbaar'
      and pr.approved = true
  )
);

create policy "leaders can manage comments"
on public.prayer_comments
for all
using (
  exists (
    select 1 from public.prayer_requests pr
    where pr.id = request_id
      and public.is_church_leader(pr.church_id)
  )
)
with check (
  exists (
    select 1 from public.prayer_requests pr
    where pr.id = request_id
      and public.is_church_leader(pr.church_id)
  )
);

create policy "public can read events for visible churches"
on public.prayer_events
for select
using (true);

create policy "leaders can manage events"
on public.prayer_events
for all
using (public.is_church_leader(church_id))
with check (public.is_church_leader(church_id));

create or replace view public.prayer_request_stats as
select
  pr.*,
  coalesce(pe.count_engagements, 0) as prayers_count,
  coalesce(pc.count_comments, 0) as comments_count
from public.prayer_requests pr
left join (
  select request_id, count(*) as count_engagements
  from public.prayer_engagements
  group by request_id
) pe on pe.request_id = pr.id
left join (
  select request_id, count(*) as count_comments
  from public.prayer_comments
  group by request_id
) pc on pc.request_id = pr.id;

create index if not exists idx_church_members_church_id on public.church_members(church_id);
create index if not exists idx_prayer_requests_church_id on public.prayer_requests(church_id);
create index if not exists idx_prayer_requests_visibility_status on public.prayer_requests(visibility, status);
create index if not exists idx_prayer_events_church_id on public.prayer_events(church_id);
