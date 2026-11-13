import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch'
import type { LearningMap, Study } from '../data/types'
import { elbowWire, type Box, type ElbowWire } from '../utils/wires'
import { NeonCard } from './NeonCard'

const WORLD_W = 2400
const WORLD_H = 2000
/** Size of the square "plug" at each wire end. */
const PLUG = 10

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

type Sizes = Record<string, { w: number; h: number }>

/** Measures every `[data-node-id]` inside the world (unscaled px) and keeps it updated. */
function useNodeSizes(worldRef: RefObject<HTMLDivElement | null>) {
  const [sizes, setSizes] = useState<Sizes>({})

  useLayoutEffect(() => {
    const world = worldRef.current
    if (!world) return
    const measure = () => {
      const next: Sizes = {}
      world.querySelectorAll<HTMLElement>('[data-node-id]').forEach((el) => {
        next[el.dataset.nodeId!] = { w: el.offsetWidth, h: el.offsetHeight }
      })
      setSizes(next)
    }
    measure()
    const ro = new ResizeObserver(measure)
    world.querySelectorAll('[data-node-id]').forEach((el) => ro.observe(el))
    // fonts change text metrics once loaded
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [worldRef])

  return sizes
}

/** Infinite-ish pannable/zoomable canvas with tracks, studies and neon wires. */
export function StudyMap({ data, onOpen }: Props) {
  const worldRef = useRef<HTMLDivElement>(null)
  const sizes = useNodeSizes(worldRef)
  const trackById = new Map(data.tracks.map((t) => [t.id, t]))
  const studyById = new Map(data.studies.map((s) => [s.id, s]))

  const box = (key: string, x: number, y: number): Box | null => {
    const size = sizes[key]
    return size ? { x, y, ...size } : null
  }

  const wires: { key: string; wire: ElbowWire; color: string }[] = []
  const addWire = (key: string, a: Box | null, b: Box | null, color: string) => {
    if (a && b) wires.push({ key, wire: elbowWire(a, b), color })
  }

  for (const s of data.studies) {
    // `links` = previous study in a series. Only the first of a series
    // (no valid link) is wired to the track; the rest chain to each other.
    const previous = (s.links ?? []).map((id) => studyById.get(id)).filter((p) => p !== undefined)
    const me = box(`study:${s.id}`, s.x, s.y)
    const track = trackById.get(s.trackId)
    if (track && previous.length === 0) {
      addWire(`${track.id}-${s.id}`, box(`track:${track.id}`, track.x, track.y), me, track.color)
    }
    for (const p of previous) {
      addWire(`${p.id}-${s.id}`, box(`study:${p.id}`, p.x, p.y), me, 'violet')
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
        <div ref={worldRef} className="world" style={{ width: WORLD_W, height: WORLD_H }}>
          <svg className="wires" width={WORLD_W} height={WORLD_H} aria-hidden="true">
            {wires.map(({ key, wire, color }) => (
              <g key={key} className={`wire-group wire--${color}`}>
                <path d={wire.d} className="wire" />
                {[wire.start, wire.end].map((p, i) => (
                  <rect
                    key={i}
                    className="wire-plug"
                    x={p.x - PLUG / 2}
                    y={p.y - PLUG / 2}
                    width={PLUG}
                    height={PLUG}
                  />
                ))}
              </g>
            ))}
          </svg>

          {data.tracks.map((t) => (
            <div
              key={t.id}
              data-node-id={`track:${t.id}`}
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
