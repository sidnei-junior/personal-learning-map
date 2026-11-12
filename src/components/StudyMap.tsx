import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch'
import type { LearningMap, Study } from '../data/types'
import { NeonCard } from './NeonCard'

const WORLD_W = 2400
const WORLD_H = 1600

function Controls() {
  const { zoomIn, zoomOut, centerView } = useControls()
  return (
    <div className="map-controls">
      <button type="button" className="pixel-btn" onClick={() => zoomIn()} aria-label="Aproximar">+</button>
      <button type="button" className="pixel-btn" onClick={() => zoomOut()} aria-label="Afastar">−</button>
      <button type="button" className="pixel-btn" onClick={() => centerView(1)} aria-label="Centralizar">⌂</button>
    </div>
  )
}

interface Props {
  data: LearningMap
  onOpen: (study: Study) => void
}

/** Infinite-ish pannable/zoomable canvas with tracks, studies and neon wires. */
export function StudyMap({ data, onOpen }: Props) {
  const trackById = new Map(data.tracks.map((t) => [t.id, t]))
  const studyById = new Map(data.studies.map((s) => [s.id, s]))

  const wires: { key: string; x1: number; y1: number; x2: number; y2: number; color: string }[] = []
  for (const s of data.studies) {
    const track = trackById.get(s.trackId)
    if (track) {
      wires.push({ key: `${track.id}-${s.id}`, x1: track.x, y1: track.y, x2: s.x, y2: s.y, color: track.color })
    }
    for (const linkId of s.links ?? []) {
      const other = studyById.get(linkId)
      if (other && s.id < other.id) {
        wires.push({ key: `${s.id}-${other.id}`, x1: s.x, y1: s.y, x2: other.x, y2: other.y, color: 'violet' })
      }
    }
  }

  return (
    <TransformWrapper
      initialScale={0.9}
      minScale={0.3}
      maxScale={2.5}
      limitToBounds={false}
      centerOnInit
      doubleClick={{ disabled: true }}
      panning={{ excluded: ['no-pan'] }}
      wheel={{ step: 0.08 }}
    >
      <Controls />
      <TransformComponent wrapperClass="map-wrapper" contentClass="map-content">
        <div className="world" style={{ width: WORLD_W, height: WORLD_H }}>
          <svg className="wires" width={WORLD_W} height={WORLD_H} aria-hidden="true">
            {wires.map((w) => (
              <line
                key={w.key}
                x1={w.x1}
                y1={w.y1}
                x2={w.x2}
                y2={w.y2}
                className={`wire wire--${w.color}`}
              />
            ))}
          </svg>

          {data.tracks.map((t) => (
            <div
              key={t.id}
              className={`node track-sign neon--${t.color}`}
              style={{ left: t.x, top: t.y }}
            >
              <span className="track-sign__title">{t.title}</span>
              {t.subtitle && <span className="track-sign__subtitle">{t.subtitle}</span>}
            </div>
          ))}

          {data.studies.map((s) => (
            <NeonCard
              key={s.id}
              study={s}
              color={trackById.get(s.trackId)?.color ?? 'cyan'}
              onOpen={onOpen}
            />
          ))}
        </div>
      </TransformComponent>
    </TransformWrapper>
  )
}
