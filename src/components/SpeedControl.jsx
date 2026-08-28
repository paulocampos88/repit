const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]

export default function SpeedControl({ speed, setSpeed }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-zinc-300">
        Speed: <span className="text-accent2 font-semibold drop-shadow-neon-cyan">{speed}x</span>
      </span>
      <div className="flex gap-1.5 flex-wrap">
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSpeed(s)}
            className={`px-2.5 py-1.5 rounded-lg text-sm border transition-all ${
              s === speed
                ? 'bg-accent2 border-accent2 text-ink font-semibold shadow-neon-cyan'
                : 'border-white/10 text-zinc-300 hover:border-accent2/60 hover:text-accent2'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  )
}
