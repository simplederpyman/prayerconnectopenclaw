import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Globe, QrCode } from 'lucide-react'
import { SectionHeader } from '@/components/section'
import { buildChurchUrl } from '@/lib/utils'
import { Button, Card, Input, Label, Textarea } from '@/components/ui'

export function SharePage() {
  const { slug } = useParams()
  const currentSlug = slug ?? 'hoopvolle-gemeente'
  const shareUrl = `https://prayerconnect.nl${buildChurchUrl(currentSlug)}`
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="760" style="border:none;border-radius:24px;"></iframe>`

  return (
    <div className="container-soft py-8 md:py-12">
      <SectionHeader
        title="Deel je gebedsmuur"
        description="Gebruik een directe link, QR-code of embed de muur op jullie eigen website."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-5 border-white/70 bg-white/90 p-6 shadow-soft">
          <div>
            <Label>Directe link</Label>
            <div className="mt-2 flex gap-3">
              <Input className="border-white bg-muted" value={shareUrl} readOnly />
              <Button>
                <Copy className="mr-2 h-4 w-4" />
                Kopieer
              </Button>
            </div>
          </div>
          <div>
            <Label>Embed code</Label>
            <Textarea value={embedCode} readOnly className="min-h-[160px] border-white bg-muted" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-0 bg-muted p-4 shadow-none">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Globe className="h-4 w-4 text-primary" /> Website</div>
              <p className="text-sm">Plaats de muur eenvoudig op jullie kerkwebsite of intranet.</p>
            </Card>
            <Card className="border-0 bg-muted p-4 shadow-none">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium"><QrCode className="h-4 w-4 text-primary" /> QR code</div>
              <p className="text-sm">Perfect voor beamer-slides, flyers en zondagsbrief.</p>
            </Card>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center border-white/70 bg-white/90 p-6 text-center shadow-soft">
          <QRCodeSVG value={shareUrl} size={200} />
          <div className="mt-4 text-sm text-foreground/60">Scan deze code om de gebedsmuur te openen</div>
        </Card>
      </div>
    </div>
  )
}
