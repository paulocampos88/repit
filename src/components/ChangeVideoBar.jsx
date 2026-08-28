import { useState } from 'react'
import { extractVideoId } from '../utils/youtube'

export default function ChangeVideoBar({ onSubmit }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const videoId = extractVideoId(value)
    if (!videoId) {
      setError('Invalid YouTube URL. Please check and try again.')
      return
    }
    setError('')
    setValue('')
    onSubmit(videoId)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste another YouTube URL..."
          className="flex-1 rounded-lg bg-surface border border-white/10 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/30 transition-shadow"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent2 hover:bg-accent2/90 text-ink text-sm font-semibold px-4 py-2 whitespace-nowrap transition-all shadow-neon-cyan"
        >
          Load video
        </button>
      </div>
      {error && <p className="text-danger text-xs">{error}</p>}
    </form>
  )
}
