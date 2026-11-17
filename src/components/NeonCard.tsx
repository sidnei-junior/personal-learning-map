import type { Study, NeonColor } from '../data/types'
import { YoutubeEmbed } from './YoutubeEmbed'
import { CourseInfo } from './CourseInfo'
import { CoverImage } from './CoverImage'
import { formatDate } from '../utils/date'
import { latestEntries, noteEntries, truncate } from '../utils/notes'
import type { FeedKind } from '../utils/timeline'

const TOOLTIP_MAX = 180
const FEED_NOTE_MAX = 260

const FEED_LABEL: Record<FeedKind, string> = {
  study: '+ novo estudo',
  'course-start': '▶ início do curso',
  note: '✎ nova anotação',
}

interface Props {
  study: Study
  color: NeonColor
  onOpen: (study: Study) => void
  /** Feed mode: card flows in the page and shows the note of that day instead of a tooltip. */
  feed?: { kind: FeedKind; note: string | null; trackTitle?: string }
}

/** A study card styled like a small neon café sign, with a hover note tooltip. */
export function NeonCard({ study, color, onOpen, feed }: Props) {
  const total = noteEntries(study).length
  const latest = latestEntries(study)

  return (
    <article
      className={feed ? `card card--feed neon--${color}` : `node card neon--${color}`}
      data-node-id={feed ? undefined : `study:${study.id}`}
      style={feed ? undefined : { left: study.x, top: study.y }}
      tabIndex={0}
    >
      {feed ? (
        <span className="card__event">
          {FEED_LABEL[feed.kind]}
          {feed.trackTitle && <span className="card__track"> · {feed.trackTitle}</span>}
        </span>
      ) : (
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
      )}

      <header className="card__header">
        {!study.course && <time dateTime={study.date}>{formatDate(study.date)}</time>}
        <h3>{study.title}</h3>
      </header>

      {study.course && <CourseInfo study={study} course={study.course} />}

      {study.source?.type === 'youtube' ? <YoutubeEmbed source={study.source} /> : <CoverImage study={study} />}

      {study.link && (
        <a className="pixel-btn pixel-btn--amber no-pan" href={study.link.url} target="_blank" rel="noreferrer">
          ↗ abrir no {study.link.label}
        </a>
      )}

      {feed?.note && <p className="card__note">{truncate(feed.note, FEED_NOTE_MAX)}</p>}

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
