import type { LearningMap, Study, Track } from '../data/types'

export type FeedKind = 'study' | 'course-start' | 'note'

/** Something that happened on a given day: a new study, a course start or a dated note. */
export interface FeedItem {
  key: string
  kind: FeedKind
  study: Study
  track: Track | undefined
  /** The note written that day, if any. */
  note: string | null
}

export interface FeedDay {
  date: string
  items: FeedItem[]
}

/**
 * Groups everything that happened by day, newest day first.
 * A study counts on its own date; each dated note counts on its date.
 * A note written on the same day the study was registered is merged into it.
 * Days with nothing don't appear.
 */
export function buildTimeline(data: LearningMap): FeedDay[] {
  const trackById = new Map(data.tracks.map((t) => [t.id, t]))
  const byDate = new Map<string, FeedItem[]>()
  const add = (date: string, item: FeedItem) => {
    const list = byDate.get(date) ?? []
    list.push(item)
    byDate.set(date, list)
  }

  for (const study of data.studies) {
    const track = trackById.get(study.trackId)
    const entries = typeof study.notes === 'string' ? [] : study.notes
    const sameDay = entries.filter((n) => n.date === study.date).map((n) => n.text)
    const startNote = typeof study.notes === 'string' ? study.notes : sameDay.join('\n') || null

    add(study.date, {
      key: `${study.id}@${study.date}`,
      kind: study.course ? 'course-start' : 'study',
      study,
      track,
      note: startNote,
    })

    entries
      .filter((n) => n.date !== study.date)
      .forEach((n, i) =>
        add(n.date, { key: `${study.id}@${n.date}#${i}`, kind: 'note', study, track, note: n.text }),
      )
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items }))
}
