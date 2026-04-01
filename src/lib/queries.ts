import type { Church, ChurchMember, PrayerComment, PrayerEvent, PrayerRequest } from '@/lib/types'
import { assertSupabase } from '@/lib/supabase'

export async function getChurchBySlug(slug: string) {
  const supabase = assertSupabase()
  const { data, error } = await supabase.from('churches').select('*').eq('slug', slug).maybeSingle<Church>()
  if (error) throw error
  return data
}

export async function getPublicPrayerRequests(churchId: string) {
  const supabase = assertSupabase()
  const { data, error } = await supabase
    .from('prayer_request_stats')
    .select('*')
    .eq('church_id', churchId)
    .eq('visibility', 'openbaar')
    .eq('approved', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as PrayerRequest[]
}

export async function getChurchEvents(churchId: string) {
  const supabase = assertSupabase()
  const { data, error } = await supabase
    .from('prayer_events')
    .select('*')
    .eq('church_id', churchId)
    .order('event_date', { ascending: true })

  if (error) throw error
  return (data ?? []) as PrayerEvent[]
}

export async function getDashboardPrayerRequests(churchId: string) {
  const supabase = assertSupabase()
  const { data, error } = await supabase
    .from('prayer_request_stats')
    .select('*')
    .eq('church_id', churchId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as PrayerRequest[]
}

export async function getPrayerRequestById(id: string) {
  const supabase = assertSupabase()
  const { data, error } = await supabase.from('prayer_request_stats').select('*').eq('id', id).maybeSingle<PrayerRequest>()
  if (error) throw error
  return data
}

export async function getPrayerComments(requestId: string) {
  const supabase = assertSupabase()
  const { data, error } = await supabase
    .from('prayer_comments')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as PrayerComment[]
}

export async function getChurchByOwner(ownerId: string) {
  const supabase = assertSupabase()
  const { data, error } = await supabase.from('churches').select('*').eq('owner_id', ownerId).maybeSingle<Church>()
  if (error) throw error
  return data
}

export async function getChurchMembers(churchId: string) {
  const supabase = assertSupabase()
  const { data, error } = await supabase
    .from('church_members')
    .select('id, church_id, user_id, role, created_at')
    .eq('church_id', churchId)
    .order('created_at', { ascending: true })

  if (error) throw error

  return (data ?? []).map((item) => ({
    ...item,
    name: `Gebruiker ${item.user_id.slice(0, 6)}`,
    email: `${item.user_id.slice(0, 6)}@kerk.local`,
    status: 'actief',
  })) as ChurchMember[]
}

export async function getCurrentLeaderChurch() {
  const supabase = assertSupabase()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) return null

  const { data, error } = await supabase.from('churches').select('*').eq('owner_id', user.id).maybeSingle<Church>()
  if (error) throw error
  return data
}
