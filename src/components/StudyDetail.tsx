import { useEffect } from 'react'
import type { Study } from '../data/types'
import { formatDate } from '../utils/date'
import { noteEntries } from '../utils/notes'
import { CourseInfo } from './CourseInfo'
import { CoverImage } from './CoverImage'
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
        {!study.course && <time dateTime={study.date}>{formatDate(study.date)}</time>}
        <h2 id="study-title">{study.title}</h2>
        {study.course && <CourseInfo study={study} course={study.course} />}
        {study.source?.type === 'youtube' ? (
          <>
            <YoutubeEmbed source={study.source} />
            <a className="modal__link" href={study.source.url} target="_blank" rel="noreferrer">
              abrir no YouTube ↗
            </a>
          </>
        ) : (
          <CoverImage study={study} />
        )}
        <div className="modal__notes">
          {noteEntries(study).map((n, i) => (
            <section key={i} className="note">
              {n.date && <time dateTime={n.date}>{formatDate(n.date)}</time>}
              {n.text.split('\n').map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
