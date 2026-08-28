import { useState } from 'react'
import { extractVideoId } from '../utils/youtube'

export default function UrlInput({ onSubmit }) {
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
    onSubmit(videoId)
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center px-4">
      <div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          <span className="text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.15)]">Rep</span>
          <span className="text-accent drop-shadow-neon">it</span>
        </h1>
        <p className="mt-3 text-zinc-400 text-lg">
          Repeat. <span className="text-accent2">Learn.</span>{' '}
          <span className="text-loop">Master.</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste a YouTube URL..."
          className="w-full rounded-xl bg-surface border border-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 transition-shadow"
        />
        <button
          type="submit"
          className="rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold px-4 py-3 transition-all shadow-neon hover:shadow-[0_0_28px_rgba(178,75,243,0.75),0_0_56px_rgba(178,75,243,0.3)]"
        >
          Load video
        </button>
        {error && <p className="text-danger text-sm">{error}</p>}
      </form>
    </div>
  )
}
