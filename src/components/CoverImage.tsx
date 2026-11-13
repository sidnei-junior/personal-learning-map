import type { Study } from '../data/types'

/** Static cover image (for studies without a video), framed like the YouTube embed. */
export function CoverImage({ study }: { study: Study }) {
  if (!study.cover) return null
  const img = <img src={study.cover} alt="" loading="lazy" draggable={false} />

  if (!study.course) return <div className="yt yt--cover">{img}</div>

  return (
    <a
      className="yt yt--cover no-pan"
      href={study.course.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Abrir página do curso: ${study.course.name}`}
    >
      {img}
    </a>
  )
}
