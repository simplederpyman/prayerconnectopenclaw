import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { HeartHandshake, Radio, Share2 } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PublicPrayerForm } from '@/components/forms/public-prayer-form'
import { PrayerRequestCard } from '@/components/prayer-request-card'
import { SectionHeader } from '@/components/section'
import { Badge, Button, Card } from '@/components/ui'
import { getChurchBySlug, getPublicPrayerRequests } from '@/lib/queries'
import type { Church, PrayerRequest } from '@/lib/types'
import { buildChurchUrl } from '@/lib/utils'

export function PrayerWallPage() {
  const { slug } = useParams()
  const [church, setChurch] = useState<Church | null>(null)
  const [publicRequests, setPublicRequests] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentSlug = slug ?? ''
  const wallUrl = currentSlug ? `https://prayerconnect.nl${buildChurchUrl(currentSlug)}` : ''

  useEffect(() => {
    async function load() {
      if (!currentSlug) {
        setError('Geen kerk slug gevonden.')
        setLoading(false)
        return
      }

      try {
        const churchData = await getChurchBySlug(currentSlug)
        if (!churchData) {
          setError('Deze gebedsmuur bestaat nog niet.')
          setLoading(false)
          return
        }

        const requests = await getPublicPrayerRequests(churchData.id)
        setChurch(churchData)
        setPublicRequests(requests)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Onbekende fout bij het laden van de gebedsmuur.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [currentSlug])

  if (loading) {
    return (
      <div className="container-soft py-8 md:py-12">
        <EmptyState title="Gebedsmuur laden" description="PrayerConnect haalt nu live gegevens op uit Supabase." />
      </div>
    )
  }

  if (error || !church) {
    return (
      <div className="container-soft py-8 md:py-12">
        <EmptyState title="Gebedsmuur niet beschikbaar" description={error ?? 'De kerk kon niet worden geladen.'} />
      </div>
    )
  }

  return (
    <div className="container-soft py-8 md:py-12">
      <div className="mb-8 grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden border-white/70 bg-white/90 p-6 shadow-soft md:p-8" style={{ borderTop: `5px solid ${church.primary_color}` }}>
          <Badge className="mb-4">{church.name}</Badge>
          <SectionHeader
            title="Gebedsmuur"
            description="Deel een gebedsverzoek, bid mee met anderen en blijf als gemeente betrokken. Iedereen kan meekijken zonder login."
            className="mb-4"
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 bg-muted p-4 shadow-none">
              <div className="text-sm text-foreground/60">Openbare verzoeken</div>
              <div className="mt-1 text-3xl font-semibold">{publicRequests.length}</div>
            </Card>
            <Card className="border-0 bg-muted p-4 shadow-none">
              <div className="text-sm text-foreground/60">Mensen bidden mee</div>
              <div className="mt-1 text-3xl font-semibold">{publicRequests.reduce((sum, item) => sum + (item.prayers_count ?? 0), 0)}</div>
            </Card>
            <Card className="border-0 bg-muted p-4 shadow-none">
              <div className="text-sm text-foreground/60">Realtime</div>
              <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-primary">
                <Radio className="h-4 w-4" /> Realtime via Supabase
              </div>
            </Card>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button>
              <HeartHandshake className="mr-2 h-4 w-4" />
              Deel een verzoek
            </Button>
            <Button asChild variant="outline">
              <Link to={buildChurchUrl(currentSlug, 'delen')}>
                <Share2 className="mr-2 h-4 w-4" />
                Deel deze muur
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center border-white/70 bg-white/90 p-6 text-center shadow-soft">
          <div className="rounded-2xl bg-white p-4 shadow-soft">
            <QRCodeSVG value={wallUrl} size={160} />
          </div>
          <div className="mt-4 text-sm text-foreground/60">Scan om direct naar de gebedsmuur te gaan</div>
          <div className="mt-2 break-all text-sm font-medium text-primary">{wallUrl}</div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          {publicRequests.length ? (
            publicRequests.map((request) => <PrayerRequestCard key={request.id} request={request} />)
          ) : (
            <EmptyState title="Nog geen openbare verzoeken" description="Zodra er een goedgekeurd openbaar verzoek is, verschijnt het hier automatisch." />
          )}
        </div>
        <div>
          <PublicPrayerForm />
        </div>
      </div>
    </div>
  )
}
