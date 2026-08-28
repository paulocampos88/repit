import { useEffect, useRef, useState } from 'react'
import { formatTime, parseTime } from '../utils/youtube'

const MIN_GAP = 1

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

export default function LoopControls({
  duration,
  loopStart,
  loopEnd,
  setLoopStart,
  setLoopEnd,
  loopEnabled,
  setLoopEnabled,
  onSeek,
  getCurrentTime,
}) {
  const includeHours = duration >= 3600
  const [startText, setStartText] = useState(formatTime(loopStart, includeHours))
  const [endText, setEndText] = useState(formatTime(loopEnd, includeHours))
  const trackRef = useRef(null)

  function syncTextFromValues(start, end) {
    setStartText(formatTime(start, includeHours))
    setEndText(formatTime(end, includeHours))
  }

  useEffect(() => {
    syncTextFromValues(loopStart, loopEnd)
  }, [loopStart, loopEnd, includeHours])

  function getValueFromClientX(clientX) {
    if (!trackRef.current || !duration) return 0
    const rect = trackRef.current.getBoundingClientRect()
    return clamp((clientX - rect.left) / rect.width, 0, 1) * duration
  }

  // --- Start handle drag ---
  function onPointerDownStart(e) {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMoveStart(e) {
    if (e.pointerType === 'mouse' && !(e.buttons & 1)) return
    const val = getValueFromClientX(e.clientX)
    const clamped = clamp(val, 0, loopEnd - MIN_GAP)
    setLoopStart(clamped)
    setStartText(formatTime(clamped, includeHours))
    onSeek(clamped)
  }

  // --- End handle drag ---
  function onPointerDownEnd(e) {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMoveEnd(e) {
    if (e.pointerType === 'mouse' && !(e.buttons & 1)) return
    const val = getValueFromClientX(e.clientX)
    const clamped = clamp(val, loopStart + MIN_GAP, duration)
    setLoopEnd(clamped)
    setEndText(formatTime(clamped, includeHours))
    onSeek(clamped)
  }

  // Click anywhere on the track to move nearest handle
  function onTrackClick(e) {
    if (e.target.closest('.handle-drag')) return
    const val = getValueFromClientX(e.clientX)
    const distToStart = Math.abs(val - loopStart)
    const distToEnd = Math.abs(val - loopEnd)
    if (distToStart <= distToEnd) {
      const clamped = clamp(val, 0, loopEnd - MIN_GAP)
      setLoopStart(clamped)
      syncTextFromValues(clamped, loopEnd)
      onSeek(clamped)
    } else {
      const clamped = clamp(val, loopStart + MIN_GAP, duration)
      setLoopEnd(clamped)
      syncTextFromValues(loopStart, clamped)
      onSeek(clamped)
    }
  }

  function commitStartText() {
    const parsed = parseTime(startText)
    if (parsed === null) { setStartText(formatTime(loopStart, includeHours)); return }
    const clamped = clamp(parsed, 0, loopEnd - MIN_GAP)
    setLoopStart(clamped)
    syncTextFromValues(clamped, loopEnd)
  }

  function commitEndText() {
    const parsed = parseTime(endText)
    if (parsed === null) { setEndText(formatTime(loopEnd, includeHours)); return }
    const clamped = clamp(parsed, loopStart + MIN_GAP, duration)
    setLoopEnd(clamped)
    syncTextFromValues(loopStart, clamped)
  }

  function markStart() {
    const t = getCurrentTime()
    const clamped = clamp(t, 0, loopEnd - MIN_GAP)
    setLoopStart(clamped)
    syncTextFromValues(clamped, loopEnd)
  }

  function markEnd() {
    const t = getCurrentTime()
    const clamped = clamp(t, loopStart + MIN_GAP, duration)
    setLoopEnd(clamped)
    syncTextFromValues(loopStart, clamped)
  }

  function nudgeStart(delta) {
    const clamped = clamp(loopStart + delta, 0, loopEnd - MIN_GAP)
    setLoopStart(clamped)
    syncTextFromValues(clamped, loopEnd)
  }

  function nudgeEnd(delta) {
    const clamped = clamp(loopEnd + delta, loopStart + MIN_GAP, duration)
    setLoopEnd(clamped)
    syncTextFromValues(loopStart, clamped)
  }

  const startPct = duration ? (loopStart / duration) * 100 : 0
  const endPct = duration ? (loopEnd / duration) * 100 : 100

  return (
    <div className="w-full flex flex-col gap-4 rounded-2xl border border-white/5 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm">
      {/* Dual-range slider */}
      <div className="dual-range" ref={trackRef} onClick={onTrackClick}>
        <div className="track" />
        <div
          className="range-highlight"
          style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
        />

        {/* Start handle — ball above track */}
        <div
          className="handle-drag start"
          style={{ left: `${startPct}%` }}
          onPointerDown={onPointerDownStart}
          onPointerMove={onPointerMoveStart}
        >
          <div className="handle-ball" />
          <div className="handle-line" />
        </div>

        {/* End handle — ball below track */}
        <div
          className="handle-drag end"
          style={{ left: `${endPct}%` }}
          onPointerDown={onPointerDownEnd}
          onPointerMove={onPointerMoveEnd}
        >
          <div className="handle-line" />
          <div className="handle-ball" />
        </div>
      </div>

      {/* Time controls row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => nudgeStart(-0.5)}
            className="text-xs bg-white/5 hover:bg-accent/10 text-zinc-200 hover:text-accent border border-white/20 hover:border-accent/60 rounded-lg px-2 py-2 whitespace-nowrap transition-colors"
          >
            -0.5s
          </button>
          <input
            type="text"
            value={startText}
            onChange={(e) => setStartText(e.target.value)}
            onBlur={commitStartText}
            className="w-24 rounded-lg bg-surface border border-white/10 px-2 py-2 text-center text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="button"
            onClick={() => nudgeStart(0.5)}
            className="text-xs bg-white/5 hover:bg-accent/10 text-zinc-200 hover:text-accent border border-white/20 hover:border-accent/60 rounded-lg px-2 py-2 whitespace-nowrap transition-colors"
          >
            +0.5s
          </button>
          <button
            type="button"
            onClick={markStart}
            className="text-sm bg-white/5 hover:bg-accent/10 text-zinc-200 hover:text-accent border border-white/20 hover:border-accent/60 rounded-lg px-3 py-2 whitespace-nowrap transition-colors"
          >
            📍 Set start
          </button>
        </div>

        <div className="flex-1 flex items-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={markEnd}
            className="text-sm bg-white/5 hover:bg-accent/10 text-zinc-200 hover:text-accent border border-white/20 hover:border-accent/60 rounded-lg px-3 py-2 whitespace-nowrap transition-colors"
          >
            📍 Set end
          </button>
          <button
            type="button"
            onClick={() => nudgeEnd(-0.5)}
            className="text-xs bg-white/5 hover:bg-accent/10 text-zinc-200 hover:text-accent border border-white/20 hover:border-accent/60 rounded-lg px-2 py-2 whitespace-nowrap transition-colors"
          >
            -0.5s
          </button>
          <input
            type="text"
            value={endText}
            onChange={(e) => setEndText(e.target.value)}
            onBlur={commitEndText}
            className="w-24 rounded-lg bg-surface border border-white/10 px-2 py-2 text-center text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="button"
            onClick={() => nudgeEnd(0.5)}
            className="text-xs bg-white/5 hover:bg-accent/10 text-zinc-200 hover:text-accent border border-white/20 hover:border-accent/60 rounded-lg px-2 py-2 whitespace-nowrap transition-colors"
          >
            +0.5s
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          role="switch"
          aria-checked={loopEnabled}
          onClick={() => setLoopEnabled((v) => !v)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${
            loopEnabled
              ? 'bg-loop text-ink shadow-neon-loop'
              : 'bg-white/5 text-zinc-200 border border-white/10'
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              loopEnabled ? 'bg-ink' : 'bg-zinc-400'
            }`}
          />
          Loop {loopEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  )
}
