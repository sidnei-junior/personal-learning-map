import { useMemo } from 'react'
import type { LearningMap, Study } from '../data/types'
import { formatDate } from '../utils/date'
import { buildTimeline } from '../utils/timeline'
import { NeonCard } from './NeonCard'

interface Props {
  data: LearningMap
  onOpen: (study: Study) => void
}

/** Vertical feed: one row per day that had activity, newest first. */
export function StudyFeed({ data, onOpen }: Props) {
  const days = useMemo(() => buildTimeline(data), [data])

  return (
    <div className="feed">
      {days.map((day) => (
        <section key={day.date} className="feed__day">
          <header className="feed__date">
            <time dateTime={day.date}>{formatDate(day.date)}</time>
            <span>
              {day.items.length} {day.items.length === 1 ? 'item' : 'itens'}
            </span>
          </header>
          <div className="feed__row">
            {day.items.map((item) => (
              <NeonCard
                key={item.key}
                study={item.study}
                color={item.track?.color ?? 'cyan'}
                onOpen={onOpen}
                feed={{ kind: item.kind, note: item.note, trackTitle: item.track?.title }}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
