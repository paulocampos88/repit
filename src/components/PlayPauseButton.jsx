export default function PlayPauseButton({ isPlaying, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      className="flex items-center justify-center h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-white transition-all shadow-neon"
    >
      {isPlaying ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  )
}
