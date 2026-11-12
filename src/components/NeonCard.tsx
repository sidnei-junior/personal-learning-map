import type { Study, NeonColor } from '../data/types'
import { YoutubeEmbed } from './YoutubeEmbed'
import { CourseInfo } from './CourseInfo'
import { formatDate } from '../utils/date'
import { latestEntries, noteEntries, truncate } from '../utils/notes'

const TOOLTIP_MAX = 180

interface Props {
  study: Study
  color: NeonColor
  onOpen: (study: Study) => void
}

/** A study card styled like a small neon café sign, with a hover note tooltip. */
export function NeonCard({ study, color, onOpen }: Props) {
  const total = noteEntries(study).length
  const latest = latestEntries(study)

  return (
    <article
      className={`node card neon--${color}`}
      data-node-id={`study:${study.id}`}
      style={{ left: study.x, top: study.y }}
      tabIndex={0}
    >
      <div className="tooltip" role="tooltip">
        <span className="tooltip__label">
          ✎ {total > 1 ? `${total} anotações · últimas` : 'anotação'}
        </span>
        {latest.map((n, i) => (
          <div key={i} className="tooltip__entry">
            {n.date && <time dateTime={n.date}>{formatDate(n.date)}</time>}
            <p>{truncate(n.text, TOOLTIP_MAX)}</p>
          </div>
        ))}
      </div>

      <header className="card__header">
        {!study.course && <time dateTime={study.date}>{formatDate(study.date)}</time>}
        <h3>{study.title}</h3>
      </header>

      {study.course && <CourseInfo study={study} course={study.course} />}

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
