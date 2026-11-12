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

/** A single study entry (lesson, video, article...). */
export interface Study {
  id: string
  trackId: string
  title: string
  /** ISO date, YYYY-MM-DD */
  date: string
  tags: string[]
  /** Free text; shown truncated in the hover tooltip, full in the detail view. */
  notes: string
  source?: YoutubeSource
  /** Ids of other studies this one connects to. */
  links?: string[]
  x: number
  y: number
}

export interface LearningMap {
  tracks: Track[]
  studies: Study[]
}
