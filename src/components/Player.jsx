import { useEffect, useRef, useState } from 'react'

function FullscreenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

function ExitFullscreenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

export default function Player({ containerRef, isReady }) {
  const wrapperRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    function onChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      wrapperRef.current?.requestFullscreen()
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full bg-zinc-900 rounded-xl overflow-hidden shadow-2xl"
      style={{ aspectRatio: '16/9' }}
    >
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-zinc-600 border-t-accent animate-spin" />
        </div>
      )}

      {/* YouTube player mounts here — React never touches its children */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Fullscreen button */}
      {isReady && (
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Sair do modo tela cheia' : 'Tela cheia'}
          className="absolute top-2 right-2 z-10 flex items-center justify-center h-8 w-8 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors backdrop-blur-sm"
        >
          {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
        </button>
      )}
    </div>
  )
}
