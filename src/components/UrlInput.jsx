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
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Rep<span className="text-accent">it</span>
        </h1>
        <p className="mt-2 text-zinc-400 text-lg">Repeat. Learn. Master.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste a YouTube URL..."
          className="w-full rounded-xl bg-zinc-800 border border-zinc-600 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="submit"
          className="rounded-xl bg-accent hover:bg-accent/90 text-white font-medium px-4 py-3 transition-colors"
        >
          Load video
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  )
}
