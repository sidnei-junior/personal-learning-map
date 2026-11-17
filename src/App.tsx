import { useState } from 'react'
import rawData from './data/studies.json'
import type { LearningMap, Study } from './data/types'
import { RainBackground } from './components/RainBackground'
import { Cover } from './components/Cover'
import { StudyMap } from './components/StudyMap'
import { StudyFeed } from './components/StudyFeed'
import { StudyDetail } from './components/StudyDetail'

const data = rawData as LearningMap

type View = 'map' | 'feed'
const VIEW_KEY = 'plm:view'

function loadView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'feed' ? 'feed' : 'map'
  } catch {
    return 'map'
  }
}

export default function App() {
  const [entered, setEntered] = useState(false)
  const [selected, setSelected] = useState<Study | null>(null)
  const [view, setView] = useState<View>(loadView)

  const changeView = (next: View) => {
    setView(next)
    try {
      localStorage.setItem(VIEW_KEY, next)
    } catch {
      // storage unavailable (private mode): just don't remember
    }
  }

  return (
    <>
      <RainBackground />
      {entered ? (
        <main className="app">
          <header className={`topbar topbar--${view}`}>
            <button type="button" className="topbar__brand neon--pink" onClick={() => setEntered(false)}>
              personal learning map
            </button>
            <div className="view-toggle" role="group" aria-label="Modo de visualização">
              <button
                type="button"
                className="pixel-btn"
                aria-pressed={view === 'map'}
                onClick={() => changeView('map')}
              >
                ◇ mapa
              </button>
              <button
                type="button"
                className="pixel-btn"
                aria-pressed={view === 'feed'}
                onClick={() => changeView('feed')}
              >
                ☰ feed
              </button>
            </div>
            <span className="topbar__hint">
              {view === 'map' ? 'arraste para mover · role para zoom' : 'o que rolou em cada dia'}
            </span>
          </header>
          {view === 'map' ? (
            <StudyMap data={data} onOpen={setSelected} />
          ) : (
            <StudyFeed data={data} onOpen={setSelected} />
          )}
        </main>
      ) : (
        <Cover onEnter={() => setEntered(true)} totalStudies={data.studies.length} />
      )}
      {selected && <StudyDetail study={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
