import { useEffect } from 'react'
import type { Study } from '../data/types'
import { formatDate } from '../utils/date'
import { YoutubeEmbed } from './YoutubeEmbed'

interface Props {
  study: Study
  onClose: () => void
}

/** Modal with the full notes of a study. */
export function StudyDetail({ study, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="study-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="pixel-btn modal__close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>
        <time dateTime={study.date}>{formatDate(study.date)}</time>
        <h2 id="study-title">{study.title}</h2>
        {study.source?.type === 'youtube' && (
          <>
            <YoutubeEmbed source={study.source} />
            <a className="modal__link" href={study.source.url} target="_blank" rel="noreferrer">
              abrir no YouTube ↗
            </a>
          </>
        )}
        <div className="modal__notes">
          {study.notes.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
