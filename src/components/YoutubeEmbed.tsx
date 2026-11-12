import { useState } from 'react'
import type { YoutubeSource } from '../data/types'

/** Lazy YouTube embed: shows the thumbnail and only loads the iframe on click. */
export function YoutubeEmbed({ source }: { source: YoutubeSource }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className="yt yt--playing no-pan">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${source.videoId}?autoplay=1`}
          title={source.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className="yt no-pan"
      onClick={() => setPlaying(true)}
      aria-label={`Assistir: ${source.title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${source.videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        draggable={false}
      />
      <span className="yt__play" aria-hidden="true">▶</span>
      <span className="yt__channel">{source.channel}</span>
    </button>
  )
}
