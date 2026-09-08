import { useState } from 'react'

export default function SaveClipButton({ onSave, disabled }) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(label.trim())
    setSaving(false)
    setOpen(false)
    setLabel('')
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setOpen(false)
      setLabel('')
    }
  }

  if (open) {
    return (
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <input
          type="text"
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nome do trecho (opcional)"
          className="rounded-lg bg-surface border border-white/10 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="text-sm rounded-lg bg-accent hover:bg-accent/90 text-white font-semibold px-3 py-2 shadow-neon-sm disabled:opacity-50 transition-all"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            setLabel('')
          }}
          className="text-sm text-zinc-400 hover:text-white px-2 transition-colors"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className={`flex items-center gap-2 text-sm rounded-lg border px-3 py-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
          savedFlash
            ? 'border-accent text-accent shadow-neon-sm'
            : 'border-white/15 text-zinc-300 hover:border-accent/60 hover:text-accent'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          <path d="M9.5 9h5M12 6.5v5" />
        </svg>
        {savedFlash ? 'Trecho salvo!' : 'Salvar trecho'}
      </button>
    </div>
  )
}
