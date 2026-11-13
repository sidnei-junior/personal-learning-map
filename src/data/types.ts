export type NeonColor = 'pink' | 'cyan' | 'amber' | 'lime' | 'violet'

/** A learning track (e.g. "System Design"). Rendered as a big neon sign. */
export interface Track {
  id: string
  title: string
  subtitle?: string
  color: NeonColor
  /** Position on the map canvas, in px. */
  x: number
  y: number
}

export interface YoutubeSource {
  type: 'youtube'
  videoId: string
  title: string
  channel: string
  url: string
}

export interface Course {
  name: string
  url: string
  /** Paid / closed course */
  closed?: boolean
  /** ISO date of completion; null while in progress. */
  endDate: string | null
}

/** A dated note, appended over time (used mainly for courses). */
export interface NoteEntry {
  date: string
  text: string
}

/** A single study entry (lesson, video, article, course...). */
export interface Study {
  id: string
  trackId: string
  title: string
  /** ISO date, YYYY-MM-DD. For courses, this is the start date. */
  date: string
  tags: string[]
  /**
   * Free text, or a list of dated entries (newest last).
   * Shown truncated in the hover tooltip, full in the detail view.
   */
  notes: string | NoteEntry[]
  source?: YoutubeSource
  course?: Course
  /** Image URL shown in place of the video when there is no YouTube source. */
  cover?: string
  /** Previous study in a series. When set, this study chains to it instead of the track. */
  links?: string[]
  x: number
  y: number
}

export interface LearningMap {
  tracks: Track[]
  studies: Study[]
}
