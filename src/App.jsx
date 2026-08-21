import { useEffect, useRef, useState } from 'react'
import UrlInput from './components/UrlInput'
import Player from './components/Player'
import LoopControls from './components/LoopControls'
import SpeedControl from './components/SpeedControl'
import AdBanner from './components/AdBanner'
import CopyLinkButton from './components/CopyLinkButton'
import PlayPauseButton from './components/PlayPauseButton'
import ChangeVideoBar from './components/ChangeVideoBar'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'

function readParamsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const v = params.get('v')
  const a = Number(params.get('a'))
  const b = Number(params.get('b'))
  const speed = Number(params.get('speed'))
  return {
    videoId: v || null,
    a: Number.isFinite(a) && a >= 0 ? a : 0,
    b: Number.isFinite(b) && b > 0 ? b : null,
    speed: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].includes(speed) ? speed : 1,
  }
}

function App() {
  const initial = useRef(readParamsFromUrl()).current
  const [videoId, setVideoId] = useState(initial.videoId)
  const [loadKey, setLoadKey] = useState(0)
  const [loopStart, setLoopStart] = useState(initial.a)
  const [loopEnd, setLoopEnd] = useState(initial.b)
  const [loopEnabled, setLoopEnabled] = useState(true)
  const [speed, setSpeed] = useState(initial.speed)

  const playerContainerRef = useRef(null)
  const { player, isReady, duration, error, isPlaying } = useYouTubePlayer(
    playerContainerRef,
    videoId,
    loadKey,
  )

  // Once duration known, default loopEnd if not set from URL
  useEffect(() => {
    if (isReady && duration > 0 && (loopEnd === null || loopEnd > duration)) {
      setLoopEnd(duration)
    }
  }, [isReady, duration, loopEnd])

  // Apply playback rate
  useEffect(() => {
    if (player && isReady) {
      player.setPlaybackRate(speed)
    }
  }, [player, isReady, speed])

  // Loop polling
  useEffect(() => {
    if (!loopEnabled || !player || !isReady) return
    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime()
      if (currentTime >= loopEnd || currentTime < loopStart) {
        player.seekTo(loopStart, true)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [loopEnabled, loopStart, loopEnd, player, isReady])

  // Sync state to URL query params
  useEffect(() => {
    if (!videoId) return
    const params = new URLSearchParams()
    params.set('v', videoId)
    params.set('a', String(Math.round(loopStart)))
    if (loopEnd !== null) params.set('b', String(Math.round(loopEnd)))
    params.set('speed', String(speed))
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [videoId, loopStart, loopEnd, speed])

  function handleSeek(time) {
    if (player && isReady) {
      player.seekTo(time, true)
    }
  }

  function togglePlayPause() {
    if (!player || !isReady) return
    if (isPlaying) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  // Keyboard hotkeys
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.code === 'Space') {
        e.preventDefault()
        togglePlayPause()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [player, isReady, isPlaying])

  function getCurrentTime() {
    return player && isReady ? player.getCurrentTime() : 0
  }

  function handleUrlSubmit(id) {
    setLoopStart(0)
    setLoopEnd(null)
    setSpeed(1)
    setVideoId(id)
    setLoadKey((k) => k + 1) // force reload even if same video ID
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-8 py-4">
        <span className="text-xl font-bold text-white">
          Rep<span className="text-accent">it</span>
        </span>
        {videoId && <CopyLinkButton getUrl={() => window.location.href} />}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 gap-8">
        {!videoId && <UrlInput onSubmit={handleUrlSubmit} />}

        {videoId && (
          <div className="w-full max-w-5xl flex flex-col gap-6">
            <ChangeVideoBar onSubmit={handleUrlSubmit} />

            <Player containerRef={playerContainerRef} isReady={isReady} />

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            {isReady && duration > 0 && (
              <>
                <div className="flex justify-center">
                  <PlayPauseButton isPlaying={isPlaying} onToggle={togglePlayPause} />
                </div>
                <LoopControls
                  key={videoId}
                  duration={duration}
                  loopStart={loopStart}
                  loopEnd={loopEnd ?? duration}
                  setLoopStart={setLoopStart}
                  setLoopEnd={setLoopEnd}
                  loopEnabled={loopEnabled}
                  setLoopEnabled={setLoopEnabled}
                  onSeek={handleSeek}
                  getCurrentTime={getCurrentTime}
                />
                <SpeedControl speed={speed} setSpeed={setSpeed} />
              </>
            )}
          </div>
        )}
      </main>

      <AdBanner />
    </div>
  )
}

export default App
