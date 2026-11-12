import type { Study, NeonColor } from '../data/types'
import { YoutubeEmbed } from './YoutubeEmbed'
import { formatDate } from '../utils/date'

const TOOLTIP_MAX = 180

interface Props {
  study: Study
  color: NeonColor
  onOpen: (study: Study) => void
}

/** A study card styled like a small neon café sign, with a hover note tooltip. */
export function NeonCard({ study, color, onOpen }: Props) {
  const preview =
    study.notes.length > TOOLTIP_MAX ? study.notes.slice(0, TOOLTIP_MAX).trimEnd() + '…' : study.notes

  return (
    <article
      className={`node card neon--${color}`}
      style={{ left: study.x, top: study.y }}
      tabIndex={0}
    >
      <div className="tooltip" role="tooltip">
        <span className="tooltip__label">✎ anotação</span>
        <p>{preview}</p>
      </div>

      <header className="card__header">
        <time dateTime={study.date}>{formatDate(study.date)}</time>
        <h3>{study.title}</h3>
      </header>

      {study.source?.type === 'youtube' && <YoutubeEmbed source={study.source} />}

      <ul className="card__tags">
        {study.tags.map((t) => (
          <li key={t}>#{t}</li>
        ))}
      </ul>

      <button type="button" className="pixel-btn no-pan" onClick={() => onOpen(study)}>
        ver anotações
      </button>
    </article>
  )
}
