# PrayerConnect

PrayerConnect is een gratis, mobielvriendelijk gebedsplatform voor kerken. Dit project is opgezet als multi-tenant SaaS met een React + TypeScript frontend en Supabase als backend voor auth, database, realtime en row-level security.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
- shadcn/ui-stijl componenten
- Recharts
- Lucide icons
- Framer Motion

## Kernroutes

### Publiek
- `/`
- `/login`
- `/register`
- `/kerk/:slug/gebedsmuur`
- `/kerk/:slug/delen`

### Dashboard
- `/dashboard`
- `/dashboard/verzoeken`
- `/dashboard/verzoek/:id`
- `/dashboard/nieuw`
- `/dashboard/kalender`
- `/dashboard/team`
- `/dashboard/rapporten`
- `/dashboard/instellingen`

## Starten

1. Installeer dependencies:
   `npm install`
2. Kopieer `.env.example` naar `.env`
3. Vul je Supabase projectgegevens in
4. Start de app:
   `npm run dev`

## Supabase

Voer `supabase/schema.sql` uit in de SQL editor van Supabase.

Belangrijke punten:
- Multi-tenant per kerk via `church_id`
- Publieke gebedsmuur zonder login
- Leidersdashboard met auth en RLS
- Publieke leesrechten alleen voor goedgekeurde openbare verzoeken

## Nog te koppelen

De frontend bevat nu een volledige starterstructuur en voorbeelddata. Volgende stap is het vervangen van mock data door echte Supabase queries en auth flows.
