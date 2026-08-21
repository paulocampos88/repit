export function extractVideoId(url) {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function formatTime(seconds, includeHours = false) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0
  const totalSeconds = Math.floor(seconds)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  if (includeHours || h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function parseTime(text) {
  if (!text) return null
  const parts = text.split(':').map((p) => p.trim())
  if (parts.some((p) => p === '' || Number.isNaN(Number(p)))) return null

  let seconds = 0
  if (parts.length === 3) {
    const [h, m, s] = parts.map(Number)
    seconds = h * 3600 + m * 60 + s
  } else if (parts.length === 2) {
    const [m, s] = parts.map(Number)
    seconds = m * 60 + s
  } else if (parts.length === 1) {
    seconds = Number(parts[0])
  } else {
    return null
  }

  return seconds >= 0 ? seconds : null
}
