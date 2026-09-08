import { supabase } from './supabaseClient'

export async function fetchClips(userId, limit = 50) {
  if (!supabase || !userId) return []
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('[repit] fetchClips:', error.message)
    return []
  }
  return data ?? []
}

export async function addClip({ userId, videoId, title, thumbnailUrl, label, startTime, endTime, speed }) {
  if (!supabase || !userId || !videoId) return
  const { error } = await supabase.from('clips').insert({
    user_id: userId,
    video_id: videoId,
    title,
    thumbnail_url: thumbnailUrl,
    label: label || null,
    start_time: startTime,
    end_time: endTime,
    speed,
  })
  if (error) console.error('[repit] addClip:', error.message)
}

export async function deleteClip(userId, id) {
  if (!supabase || !userId) return
  const { error } = await supabase.from('clips').delete().eq('user_id', userId).eq('id', id)
  if (error) console.error('[repit] deleteClip:', error.message)
}
