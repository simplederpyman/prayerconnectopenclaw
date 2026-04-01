import { AuthForm } from '@/components/forms/auth-form'
import { SectionHeader } from '@/components/section'

export function LoginPage() {
  return (
    <div className="container-soft py-8 md:py-14">
      <SectionHeader
        title="Inloggen als leider"
        description="Beheer gebedsverzoeken, teamleden, kalender en instellingen van je kerk vanuit één helder dashboard."
        className="mb-8 text-center"
      />
      <AuthForm mode="login" />
    </div>
  )
}
