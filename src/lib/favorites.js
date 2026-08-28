import { supabase } from './supabaseClient'

export async function fetchFavorites(userId) {
  if (!supabase || !userId) return []
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[repit] fetchFavorites:', error.message)
    return []
  }
  return data ?? []
}

export async function isFavorite(userId, videoId) {
  if (!supabase || !userId || !videoId) return false
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .maybeSingle()
  if (error) {
    console.error('[repit] isFavorite:', error.message)
    return false
  }
  return Boolean(data)
}

export async function addFavorite({ userId, videoId, title, thumbnailUrl }) {
  if (!supabase || !userId || !videoId) return
  const { error } = await supabase.from('favorites').upsert(
    { user_id: userId, video_id: videoId, title, thumbnail_url: thumbnailUrl },
    { onConflict: 'user_id,video_id' },
  )
  if (error) console.error('[repit] addFavorite:', error.message)
}

export async function removeFavorite(userId, videoId) {
  if (!supabase || !userId || !videoId) return
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('video_id', videoId)
  if (error) console.error('[repit] removeFavorite:', error.message)
}
