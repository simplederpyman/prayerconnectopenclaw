import { AuthForm } from '@/components/forms/auth-form'
import { SectionHeader } from '@/components/section'

export function RegisterPage() {
  return (
    <div className="container-soft py-8 md:py-14">
      <SectionHeader
        title="Maak gratis een kerkaccount aan"
        description="Start in een paar minuten en ga daarna direct naar een werkend dashboard met je eigen deelbare gebedsmuur-link."
        className="mb-8 text-center"
      />
      <AuthForm mode="register" />
    </div>
  )
}
