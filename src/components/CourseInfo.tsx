import type { Course, Study } from '../data/types'
import { formatDate } from '../utils/date'

/** Start/end dates + link to the course page. */
export function CourseInfo({ study, course }: { study: Study; course: Course }) {
  return (
    <div className="course">
      <dl className="course__dates">
        <div>
          <dt>início</dt>
          <dd>{formatDate(study.date)}</dd>
        </div>
        <div>
          <dt>conclusão</dt>
          <dd className={course.endDate ? '' : 'course__pending'}>
            {course.endDate ? formatDate(course.endDate) : '— em andamento'}
          </dd>
        </div>
      </dl>
      <div className="course__actions">
        <a className="pixel-btn pixel-btn--amber no-pan" href={course.url} target="_blank" rel="noreferrer">
          🎟 ver curso ↗
        </a>
        {course.closed && <span className="course__badge">curso fechado</span>}
      </div>
    </div>
  )
}
