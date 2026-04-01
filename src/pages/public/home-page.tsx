import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeartHandshake, QrCode, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { SectionHeader } from '@/components/section'
import { Badge, Button, Card } from '@/components/ui'

const features = [
  {
    title: 'Openbare gebedsmuur',
    description: 'Iedereen kan gebedsverzoeken zien, meebidden en nieuwe verzoeken delen zonder account.',
    icon: HeartHandshake,
  },
  {
    title: 'Veilig leidersdashboard',
    description: 'Leiders beheren verzoeken, teamleden, instellingen en rapportages op één rustige plek.',
    icon: ShieldCheck,
  },
  {
    title: 'Delen met QR en link',
    description: 'Verspreid je gebedsmuur eenvoudig in de kerk, nieuwsbrief of website.',
    icon: QrCode,
  },
  {
    title: 'Realtime betrokkenheid',
    description: 'Nieuwe verzoeken en “ik bid mee” updates verschijnen direct voor je gemeente.',
    icon: Sparkles,
  },
]

export function HomePage() {
  return (
    <div>
      <section className="container-soft grid gap-10 py-12 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Badge className="mb-4 bg-secondary/15 text-secondary">Volledig gratis voor kerken</Badge>
          <SectionHeader
            title="Breng je gemeente samen in gebed"
            description="PrayerConnect helpt kerken om gebedsverzoeken warm, eenvoudig en mobielvriendelijk te delen — zonder gedoe, zonder betaalmuur."
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/register">Start gratis</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/kerk/jouw-kerk/gebedsmuur">Open voorbeeldroute</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-foreground/70">
            <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Geen login voor bezoekers</span>
            <span className="flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-primary" /> Openbaar & privé verzoeken</span>
            <span className="flex items-center gap-2"><QrCode className="h-4 w-4 text-primary" /> Klaar om te delen</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card-soft overflow-hidden border-white/70 bg-white/90 p-4 shadow-soft md:p-6"
        >
          <div className="rounded-[1.75rem] bg-gradient-to-br from-primary via-primary to-[#8B5CF6] p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm opacity-90">Jouw kerk hier</div>
                <div className="mt-2 text-2xl font-semibold">Warm en rustig leidersdashboard</div>
              </div>
              <Badge className="bg-white/15 text-white">Mobiel eerst</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/15 p-4">
                <div className="text-sm opacity-80">Open verzoeken</div>
                <div className="mt-1 text-3xl font-semibold">24</div>
                <div className="mt-2 text-sm opacity-90">+3 deze week</div>
              </div>
              <div className="rounded-2xl bg-white/15 p-4">
                <div className="text-sm opacity-80">Mensen bidden mee</div>
                <div className="mt-1 text-3xl font-semibold">138</div>
                <div className="mt-2 text-sm opacity-90">Actief in de gemeente</div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card className="border-0 bg-muted p-4 shadow-none">
              <div className="text-sm text-foreground/60">Komend gebedsmoment</div>
              <div className="mt-1 text-lg font-semibold">Vrijdag 19:30</div>
            </Card>
            <Card className="border-0 bg-muted p-4 shadow-none">
              <div className="text-sm text-foreground/60">Snelle actie</div>
              <div className="mt-1 text-lg font-semibold">Ga direct naar dashboard</div>
            </Card>
          </div>
        </motion.div>
      </section>

      <section className="container-soft py-8 md:py-14">
        <SectionHeader
          title="Gebouwd voor warme, eenvoudige betrokkenheid"
          description="Alles is ontworpen voor mobiel gebruik, duidelijke rust in het ontwerp en makkelijke adoptie binnen de gemeente."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
