import type { Study } from '../data/types'

/** Static cover image (for studies without a video), framed like the YouTube embed. */
export function CoverImage({ study }: { study: Study }) {
  if (!study.cover) return null
  const className = `yt yt--cover${study.coverStyle === 'diagram' ? ' yt--diagram' : ''}`
  const img = <img src={study.cover} alt="" loading="lazy" draggable={false} />

  // Clicking the cover opens the course page or, failing that, the study's link.
  const target = study.course
    ? { url: study.course.url, label: `Abrir página do curso: ${study.course.name}` }
    : study.link
      ? { url: study.link.url, label: `Abrir ${study.link.label}` }
      : null

  if (!target) return <div className={className}>{img}</div>

  return (
    <a
      className={`${className} no-pan`}
      href={target.url}
      target="_blank"
      rel="noreferrer"
      aria-label={target.label}
    >
      {img}
    </a>
  )
}
