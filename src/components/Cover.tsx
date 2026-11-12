import { useState } from 'react'

interface Props {
  onEnter: () => void
  totalStudies: number
}

/**
 * Café-window cover. Drop the generated image at `public/cover.png`
 * and it replaces the placeholder automatically.
 */
export function Cover({ onEnter, totalStudies }: Props) {
  const [hasImage, setHasImage] = useState(true)

  return (
    <section className="cover">
      <div className="cover__window">
        {hasImage ? (
          <img
            src="/cover.png"
            alt="Pixel art: estudando no PC com uma xícara de café enquanto chove lá fora"
            onError={() => setHasImage(false)}
          />
        ) : (
          <div className="cover__placeholder" aria-hidden="true">
            <span className="cover__cup">☕</span>
            <span>capa em breve</span>
          </div>
        )}
      </div>

      <h1 className="cover__title neon--pink">
        <span className="flicker">personal</span> learning <span className="neon--cyan">map</span>
      </h1>
      <p className="cover__open neon--amber">● OPEN · {totalStudies} {totalStudies === 1 ? 'estudo' : 'estudos'} no mapa</p>

      <button type="button" className="pixel-btn pixel-btn--big" onClick={onEnter}>
        entrar ▸
      </button>
    </section>
  )
}
