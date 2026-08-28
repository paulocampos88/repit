import { useEffect, useState } from 'react'
import { fetchHistory, deleteHistoryItem, clearHistory } from '../lib/history'
import { fetchFavorites, removeFavorite } from '../lib/favorites'

export default function HistoryFavoritesPanel({ userId, onSelectVideo, onClose }) {
  const [tab, setTab] = useState('history')
  const [history, setHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchHistory(userId), fetchFavorites(userId)]).then(([h, f]) => {
      if (cancelled) return
      setHistory(h)
      setFavorites(f)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [userId])

  async function handleRemoveFavorite(videoId) {
    setFavorites((prev) => prev.filter((f) => f.video_id !== videoId))
    await removeFavorite(userId, videoId)
  }

  async function handleDeleteHistoryItem(id) {
    setHistory((prev) => prev.filter((h) => h.id !== id))
    await deleteHistoryItem(userId, id)
  }

  async function handleClearHistory() {
    setHistory([])
    await clearHistory(userId)
  }

  const items = tab === 'history' ? history : favorites

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-[380px] max-h-[70vh] flex flex-col rounded-xl border border-white/10 bg-surface shadow-neon-sm z-40 overflow-hidden">
        <div className="flex items-center border-b border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`flex-1 text-sm font-medium py-2.5 transition-colors ${
              tab === 'history' ? 'text-accent2 border-b-2 border-accent2' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Histórico
          </button>
          <button
            type="button"
            onClick={() => setTab('favorites')}
            className={`flex-1 text-sm font-medium py-2.5 transition-colors ${
              tab === 'favorites' ? 'text-loop border-b-2 border-loop' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Favoritos
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="px-3 text-zinc-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="text-center text-sm text-zinc-500 py-6">Carregando...</p>}

          {!loading && items.length === 0 && (
            <p className="text-center text-sm text-zinc-500 py-6 px-4">
              {tab === 'history' ? 'Nenhum vídeo assistido ainda.' : 'Nenhum favorito ainda. Clique na estrela ao assistir um vídeo.'}
            </p>
          )}

          {!loading &&
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors group">
                <button
                  type="button"
                  onClick={() => onSelectVideo(item.video_id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <img
                    src={item.thumbnail_url || `https://i.ytimg.com/vi/${item.video_id}/default.jpg`}
                    alt=""
                    className="h-10 w-16 rounded object-cover bg-black/40 flex-shrink-0"
                  />
                  <span className="text-sm text-zinc-200 truncate">{item.title || item.video_id}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    tab === 'history' ? handleDeleteHistoryItem(item.id) : handleRemoveFavorite(item.video_id)
                  }
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-danger text-xs px-2 transition-opacity flex-shrink-0"
                  aria-label="Remover"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>

        {tab === 'history' && history.length > 0 && (
          <button
            type="button"
            onClick={handleClearHistory}
            className="text-xs text-zinc-500 hover:text-danger py-2 border-t border-white/10 flex-shrink-0"
          >
            Limpar histórico
          </button>
        )}
      </div>
    </>
  )
}
