import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  ChevronRight,
  FileBarChart3,
  HeartHandshake,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react'
import { Input } from '@/components/ui'
import { cn } from '@/lib/utils'

const dashboardNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/verzoeken', label: 'Verzoeken', icon: HeartHandshake },
  { to: '/dashboard/kalender', label: 'Kalender', icon: CalendarDays },
  { to: '/dashboard/team', label: 'Team', icon: Users },
  { to: '/dashboard/rapporten', label: 'Rapporten', icon: FileBarChart3 },
  { to: '/dashboard/instellingen', label: 'Instellingen', icon: Settings },
]

export function PublicLayout() {
  return (
    <div className="page-shell">
      <header className="container-soft flex items-center justify-between py-6">
        <Link to="/" className="flex items-center gap-3 text-foreground">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold">PrayerConnect</div>
            <div className="text-sm text-foreground/60">Gratis gebedsplatform voor kerken</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-2xl px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-white">
            Inloggen
          </Link>
          <Link to="/register" className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-soft">
            Start gratis
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <div className="page-shell">
      <div className="container-soft grid min-h-screen gap-4 py-4 lg:grid-cols-[280px_1fr] lg:gap-6 lg:py-6">
        <aside className="card-soft h-fit overflow-hidden border-white/70 bg-white/90 p-3 backdrop-blur md:p-4 lg:sticky lg:top-6">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-primary via-primary to-[#8B5CF6] p-4 text-white shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold tracking-tight">PrayerConnect</div>
                  <div className="text-sm text-white/75">Leidersdashboard</div>
                </div>
              </div>
              <Sparkles className="mt-1 h-4 w-4 text-white/80" />
            </div>
            <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-3 py-3">
              <div className="text-xs uppercase tracking-[0.24em] text-white/60">Actief</div>
              <div className="mt-1 text-lg font-semibold">Hoopvolle Gemeente</div>
              <div className="mt-1 flex items-center gap-1 text-sm text-white/75">
                Bekijk live activiteit
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          <nav className="mt-4 space-y-1.5">
            {dashboardNav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-white shadow-soft'
                      : 'text-foreground/75 hover:bg-muted hover:text-foreground',
                  )
                }
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 transition group-hover:bg-white/70 group-[.active]:bg-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 rounded-[1.5rem] bg-muted p-4">
            <div className="text-sm font-semibold text-foreground">Deze week</div>
            <p className="mt-1 text-sm text-foreground/60">24 open verzoeken en 138 mensen die actief meebidden.</p>
          </div>
        </aside>

        <section className="min-w-0 space-y-4 lg:space-y-6">
          <header className="card-soft flex flex-col gap-4 border-white/70 bg-white/85 p-4 backdrop-blur md:flex-row md:items-center md:justify-between md:p-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">PrayerConnect dashboard</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Welkom terug 👋</div>
              <p className="mt-1 text-sm text-foreground/60">Hier zie je in één oogopslag wat aandacht vraagt in jullie gemeente.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-[220px] flex-1 sm:flex-none">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35" />
                <Input className="h-12 rounded-2xl border-white bg-muted pl-10" placeholder="Zoek verzoek of teamlid" />
              </div>
              <button className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-muted px-4 text-foreground/70 transition hover:bg-white">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>

          <Outlet />
        </section>
      </div>
    </div>
  )
}
