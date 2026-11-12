import type { NoteEntry, Study } from '../data/types'

/** Normalizes notes to a list of entries (plain text notes become one entry without date). */
export function noteEntries(study: Study): (NoteEntry | { date: null; text: string })[] {
  if (typeof study.notes === 'string') return [{ date: null, text: study.notes }]
  return study.notes
}

/** Latest entries for the tooltip, newest first. */
export function latestEntries(study: Study, max = 2) {
  return noteEntries(study).slice(-max).reverse()
}

export function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}
