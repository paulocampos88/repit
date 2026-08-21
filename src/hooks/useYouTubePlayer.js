import { useEffect, useState } from 'react'

let apiPromise = null

function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (previous) previous()
      resolve(window.YT)
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })

  return apiPromise
}

// loadKey lets the caller force a full reload even for the same videoId
export function useYouTubePlayer(containerRef, videoId, loadKey) {
  const [player, setPlayer] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!videoId || !containerRef.current) return
    let destroyed = false
    let activePlayer = null

    setIsReady(false)
    setError(null)
    setPlayer(null)
    setIsPlaying(false)

    loadYouTubeApi().then((YT) => {
      if (destroyed || !containerRef.current) return

      // Create a plain div that the YouTube API can replace with an iframe.
      // React never manages this node's children — avoiding reconciliation conflicts.
      containerRef.current.innerHTML = ''
      const playerNode = document.createElement('div')
      playerNode.style.width = '100%'
      playerNode.style.height = '100%'
      containerRef.current.appendChild(playerNode)

      activePlayer = new YT.Player(playerNode, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            if (destroyed) return
            setPlayer(event.target)
            setDuration(event.target.getDuration())
            setIsReady(true)
          },
          onStateChange: (event) => {
            if (destroyed) return
            setIsPlaying(event.data === YT.PlayerState.PLAYING)
          },
          onError: () => {
            if (destroyed) return
            setError('Could not load this video. Please check the URL and try again.')
          },
        },
      })
    })

    return () => {
      destroyed = true
      if (activePlayer) {
        try { activePlayer.destroy() } catch (_) {}
      }
      setPlayer(null)
      setIsReady(false)
      setIsPlaying(false)
    }
  }, [containerRef, videoId, loadKey])

  return { player, isReady, duration, error, isPlaying }
}
