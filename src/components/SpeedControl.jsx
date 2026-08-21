const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]

export default function SpeedControl({ speed, setSpeed }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-zinc-300">
        Speed: <span className="text-accent font-semibold">{speed}x</span>
      </span>
      <div className="flex gap-1.5 flex-wrap">
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSpeed(s)}
            className={`px-2.5 py-1.5 rounded-lg text-sm border transition-colors ${
              s === speed
                ? 'bg-accent border-accent text-white'
                : 'border-zinc-600 text-zinc-300 hover:border-zinc-400'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  )
}
