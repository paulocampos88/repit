import { supabase } from './supabaseClient'

export async function upsertHistory({
  userId,
  videoId,
  title,
  thumbnailUrl,
  loopStart,
  loopEnd,
  speed,
}) {
  if (!supabase || !userId || !videoId) return
  const { error } = await supabase.from('history').upsert(
    {
      user_id: userId,
      video_id: videoId,
      title,
      thumbnail_url: thumbnailUrl,
      loop_start: loopStart,
      loop_end: loopEnd,
      speed,
      watched_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,video_id' },
  )
  if (error) console.error('[repit] upsertHistory:', error.message)
}

export async function fetchHistory(userId, limit = 30) {
  if (!supabase || !userId) return []
  const { data, error } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', userId)
    .order('watched_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('[repit] fetchHistory:', error.message)
    return []
  }
  return data ?? []
}

export async function deleteHistoryItem(userId, id) {
  if (!supabase || !userId) return
  const { error } = await supabase
    .from('history')
    .delete()
    .eq('user_id', userId)
    .eq('id', id)
  if (error) console.error('[repit] deleteHistoryItem:', error.message)
}

export async function clearHistory(userId) {
  if (!supabase || !userId) return
  const { error } = await supabase.from('history').delete().eq('user_id', userId)
  if (error) console.error('[repit] clearHistory:', error.message)
}
