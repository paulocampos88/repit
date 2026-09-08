import { useEffect, useState } from 'react'
import { fetchHistory, deleteHistoryItem, clearHistory } from '../lib/history'
import { fetchFavorites, removeFavorite } from '../lib/favorites'
import { fetchClips, deleteClip } from '../lib/clips'
import { formatTime } from '../utils/youtube'

const TABS = [
  { key: 'history', label: 'Histórico', activeClass: 'text-accent2 border-b-2 border-accent2' },
  { key: 'favorites', label: 'Favoritos', activeClass: 'text-loop border-b-2 border-loop' },
  { key: 'clips', label: 'Trechos', activeClass: 'text-accent border-b-2 border-accent' },
]

function clipRange(clip) {
  const includeHours = (clip.end_time ?? 0) >= 3600
  return `${formatTime(clip.start_time, includeHours)}–${formatTime(clip.end_time, includeHours)}`
}

export default function HistoryFavoritesPanel({ userId, onSelectVideo, onSelectClip, onClose }) {
  const [tab, setTab] = useState('history')
  const [history, setHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const [clips, setClips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchHistory(userId), fetchFavorites(userId), fetchClips(userId)]).then(([h, f, c]) => {
      if (cancelled) return
      setHistory(h)
      setFavorites(f)
      setClips(c)
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

  async function handleDeleteClip(id) {
    setClips((prev) => prev.filter((c) => c.id !== id))
    await deleteClip(userId, id)
  }

  const items = tab === 'history' ? history : tab === 'favorites' ? favorites : clips

  function handleSelectItem(item) {
    if (tab === 'clips') {
      onSelectClip(item)
    } else {
      onSelectVideo(item.video_id)
    }
  }

  function handleRemoveItem(item) {
    if (tab === 'history') handleDeleteHistoryItem(item.id)
    else if (tab === 'favorites') handleRemoveFavorite(item.video_id)
    else handleDeleteClip(item.id)
  }

  const emptyMessage = {
    history: 'Nenhum vídeo assistido ainda.',
    favorites: 'Nenhum favorito ainda. Clique na estrela ao assistir um vídeo.',
    clips: 'Nenhum trecho salvo ainda. Marque um início/fim e clique em "Salvar trecho".',
  }[tab]

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-[380px] max-h-[70vh] flex flex-col rounded-xl border border-white/10 bg-surface shadow-neon-sm z-40 overflow-hidden">
        <div className="flex items-center border-b border-white/10 flex-shrink-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 text-sm font-medium py-2.5 transition-colors ${
                tab === t.key ? t.activeClass : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.label}
            </button>
          ))}
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
            <p className="text-center text-sm text-zinc-500 py-6 px-4">{emptyMessage}</p>
          )}

          {!loading &&
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors group">
                <button
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <img
                    src={item.thumbnail_url || `https://i.ytimg.com/vi/${item.video_id}/default.jpg`}
                    alt=""
                    className="h-10 w-16 rounded object-cover bg-black/40 flex-shrink-0"
                  />
                  {tab === 'clips' ? (
                    <span className="min-w-0 flex flex-col">
                      <span className="text-sm text-zinc-200 truncate">{item.label || clipRange(item)}</span>
                      <span className="text-xs text-zinc-500 truncate">
                        {item.title || item.video_id}
                        {item.label ? ` · ${clipRange(item)}` : ''}
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm text-zinc-200 truncate">{item.title || item.video_id}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item)}
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
