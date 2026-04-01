import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowUpRight, Clock3, Heart, MessageSquareText, Users2 } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PrayerRequestCard } from '@/components/prayer-request-card'
import { SectionHeader } from '@/components/section'
import { Badge, Card } from '@/components/ui'
import { getChurchEvents, getDashboardPrayerRequests } from '@/lib/queries'
import type { PrayerEvent, PrayerRequest, ReportPoint } from '@/lib/types'

const DEMO_CHURCH_ID = 'church-1'
const statIcons = [Heart, Users2, MessageSquareText, Clock3]

function buildChartData(requests: PrayerRequest[]): ReportPoint[] {
  const days = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']
  const grouped = new Map<string, ReportPoint>()

  requests.forEach((request) => {
    const date = new Date(request.created_at)
    const key = days[date.getDay()]
    const existing = grouped.get(key) ?? { name: key, verzoeken: 0, betrokken: 0, comments: 0 }
    existing.verzoeken += 1
    existing.betrokken += request.prayers_count ?? 0
    existing.comments += request.comments_count ?? 0
    grouped.set(key, existing)
  })

  return days.map((day) => grouped.get(day) ?? { name: day, verzoeken: 0, betrokken: 0, comments: 0 })
}

export function DashboardPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([])
  const [events, setEvents] = useState<PrayerEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [requestData, eventData] = await Promise.all([
          getDashboardPrayerRequests(DEMO_CHURCH_ID),
          getChurchEvents(DEMO_CHURCH_ID),
        ])
        setRequests(requestData)
        setEvents(eventData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kon dashboardgegevens niet laden.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const stats = useMemo(
    () => [
      {
        label: 'Open verzoeken',
        value: String(requests.filter((item) => item.status === 'open' || item.status === 'in_gebed').length),
        hint: 'Live vanuit Supabase',
      },
      {
        label: 'Mensen bidden mee',
        value: String(requests.reduce((sum, item) => sum + (item.prayers_count ?? 0), 0)),
        hint: 'Totaal engagement',
      },
      {
        label: 'Reacties',
        value: String(requests.reduce((sum, item) => sum + (item.comments_count ?? 0), 0)),
        hint: 'Open gesprek rond gebed',
      },
      {
        label: 'Komende events',
        value: String(events.length),
        hint: 'Aankomende momenten',
      },
    ],
    [events.length, requests],
  )

  const chartData = useMemo(() => buildChartData(requests), [requests])

  if (loading) {
    return <EmptyState title="Dashboard laden" description="PrayerConnect haalt nu live gegevens op uit Supabase." />
  }

  if (error) {
    return <EmptyState title="Dashboard niet beschikbaar" description={error} />
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        description="Een rustig overzicht van betrokkenheid, open verzoeken en activiteit in jullie kerk."
        className="mb-0"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = statIcons[index] ?? Heart

          return (
            <Card key={stat.label} className="overflow-hidden border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-foreground/55">{stat.label}</div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                <ArrowUpRight className="h-4 w-4" />
                {stat.hint}
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-white/70 bg-white/90 p-5 shadow-soft md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">Betrokkenheid deze week</div>
              <p className="mt-1 text-sm text-foreground/60">Volg hoeveel mensen meebidden en waar piekmomenten zitten.</p>
            </div>
            <Badge className="w-fit bg-primary/10 text-primary">Live overzicht</Badge>
          </div>
          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="engagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B46C1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6B46C1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9DCC8" vertical={false} />
                <XAxis dataKey="name" stroke="#8A7B6A" axisLine={false} tickLine={false} />
                <YAxis stroke="#8A7B6A" axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="betrokken" stroke="#6B46C1" fill="url(#engagement)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-white/70 bg-white/90 p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">Komende momenten</div>
                <p className="mt-1 text-sm text-foreground/60">Aankomende samenkomsten en gebedsmomenten.</p>
              </div>
              <Badge className="bg-secondary/15 text-secondary">Planning</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {events.length ? (
                events.map((event) => (
                  <div key={event.id} className="rounded-2xl bg-muted p-4">
                    <div className="font-medium text-foreground">{event.title}</div>
                    <div className="mt-1 text-sm text-foreground/60">{new Date(event.event_date).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                  </div>
                ))
              ) : (
                <EmptyState title="Nog geen events" description="Voeg je eerste gebedsmoment toe in de kalender." />
              )}
            </div>
          </Card>

          {requests.length ? (
            requests.slice(0, 2).map((request) => <PrayerRequestCard key={request.id} request={request} compact />)
          ) : (
            <EmptyState title="Nog geen verzoeken" description="Zodra er verzoeken in Supabase staan, verschijnen ze hier automatisch." />
          )}
        </div>
      </div>
    </div>
  )
}
