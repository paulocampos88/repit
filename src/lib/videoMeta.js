// Busca título/thumbnail de um vídeo do YouTube via oEmbed oficial —
// não precisa de API key e tem CORS liberado para uso no navegador.
const cache = new Map()

export async function fetchVideoMeta(videoId) {
  if (cache.has(videoId)) return cache.get(videoId)

  const fallback = {
    title: null,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    author: null,
  }

  try {
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${videoId}`,
    )}&format=json`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`oEmbed ${res.status}`)
    const data = await res.json()
    const meta = {
      title: data.title || null,
      thumbnailUrl: data.thumbnail_url || fallback.thumbnailUrl,
      author: data.author_name || null,
    }
    cache.set(videoId, meta)
    return meta
  } catch {
    cache.set(videoId, fallback)
    return fallback
  }
}
