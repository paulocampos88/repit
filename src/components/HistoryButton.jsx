export default function HistoryButton({ active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label="Histórico e favoritos"
      title="Histórico e favoritos"
      className={`flex items-center justify-center h-9 w-9 rounded-lg border transition-all ${
        active
          ? 'border-accent2 text-accent2 shadow-neon-cyan'
          : 'border-white/15 text-zinc-300 hover:border-accent2/60 hover:text-accent2'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    </button>
  )
}
