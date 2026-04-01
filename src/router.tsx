import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout, PublicLayout } from '@/components/layout'
import { CalendarPage } from '@/pages/dashboard/calendar-page'
import { DashboardPage } from '@/pages/dashboard/dashboard-page'
import { NewRequestPage } from '@/pages/dashboard/new-request-page'
import { ReportsPage } from '@/pages/dashboard/reports-page'
import { RequestDetailPage } from '@/pages/dashboard/request-detail-page'
import { RequestsPage } from '@/pages/dashboard/requests-page'
import { SettingsPage } from '@/pages/dashboard/settings-page'
import { TeamPage } from '@/pages/dashboard/team-page'
import { HomePage } from '@/pages/public/home-page'
import { LoginPage } from '@/pages/public/login-page'
import { PrayerWallPage } from '@/pages/public/prayer-wall-page'
import { RegisterPage } from '@/pages/public/register-page'
import { SharePage } from '@/pages/public/share-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'kerk/:slug/gebedsmuur', element: <PrayerWallPage /> },
      { path: 'kerk/:slug/delen', element: <SharePage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'verzoeken', element: <RequestsPage /> },
      { path: 'verzoek/:id', element: <RequestDetailPage /> },
      { path: 'nieuw', element: <NewRequestPage /> },
      { path: 'kalender', element: <CalendarPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'rapporten', element: <ReportsPage /> },
      { path: 'instellingen', element: <SettingsPage /> },
    ],
  },
])
