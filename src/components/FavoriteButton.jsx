export default function FavoriteButton({ active, onToggle, disabled }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={active}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`flex items-center justify-center h-9 w-9 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? 'border-loop text-loop shadow-neon-loop'
          : 'border-white/15 text-zinc-300 hover:border-loop/60 hover:text-loop'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 18.27l-5.8 3.1 1.11-6.47-4.7-4.58 6.49-.94L12 3.5z"
        />
      </svg>
    </button>
  )
}
