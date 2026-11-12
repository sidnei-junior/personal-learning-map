import { useState } from 'react'
import rawData from './data/studies.json'
import type { LearningMap, Study } from './data/types'
import { RainBackground } from './components/RainBackground'
import { Cover } from './components/Cover'
import { StudyMap } from './components/StudyMap'
import { StudyDetail } from './components/StudyDetail'

const data = rawData as LearningMap

export default function App() {
  const [entered, setEntered] = useState(false)
  const [selected, setSelected] = useState<Study | null>(null)

  return (
    <>
      <RainBackground />
      {entered ? (
        <main className="app">
          <header className="topbar">
            <button type="button" className="topbar__brand neon--pink" onClick={() => setEntered(false)}>
              personal learning map
            </button>
            <span className="topbar__hint">arraste para mover · role para zoom</span>
          </header>
          <StudyMap data={data} onOpen={setSelected} />
        </main>
      ) : (
        <Cover onEnter={() => setEntered(true)} totalStudies={data.studies.length} />
      )}
      {selected && <StudyDetail study={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
