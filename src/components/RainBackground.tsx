import { useEffect, useRef } from 'react'

/** Pixel size: the canvas is drawn at 1/PIXEL resolution and upscaled crisp. */
const PIXEL = 3

interface Drop {
  x: number
  y: number
  len: number
  speed: number
  layer: number
}

interface Splash {
  x: number
  y: number
  life: number
}

const LAYER_COLORS = ['#1d2a55', '#2e4380', '#5b7fd1']

/** Full-screen pixel-art rain, fixed behind everything. */
export function RainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let drops: Drop[] = []
    const splashes: Splash[] = []
    let frame = 0

    const makeDrop = (randomY: boolean): Drop => {
      const layer = Math.floor(Math.random() * 3)
      return {
        x: Math.floor(Math.random() * width),
        y: randomY ? Math.floor(Math.random() * height) : -10,
        len: 2 + layer * 2,
        speed: 0.6 + layer * 0.7 + Math.random() * 0.4,
        layer,
      }
    }

    const resize = () => {
      width = Math.ceil(window.innerWidth / PIXEL)
      height = Math.ceil(window.innerHeight / PIXEL)
      canvas.width = width
      canvas.height = height
      const count = Math.floor((width * height) / 900)
      drops = Array.from({ length: count }, () => makeDrop(true))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (const d of drops) {
        ctx.fillStyle = LAYER_COLORS[d.layer]
        // slight diagonal: shift 1px left every few px of length
        for (let i = 0; i < d.len; i++) {
          ctx.fillRect(Math.floor(d.x - i / 4), Math.floor(d.y - i), 1, 1)
        }
        if (!reduceMotion) {
          d.y += d.speed
          d.x -= d.speed / 4
          if (d.y > height) {
            if (d.layer === 2 && Math.random() < 0.5) {
              splashes.push({ x: Math.floor(d.x), y: height - 1, life: 6 })
            }
            Object.assign(d, makeDrop(false))
          }
          if (d.x < 0) d.x += width
        }
      }

      ctx.fillStyle = LAYER_COLORS[2]
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i]
        const spread = 6 - s.life
        ctx.fillRect(s.x - spread, s.y - 1, 1, 1)
        ctx.fillRect(s.x + spread, s.y - 1, 1, 1)
        s.life--
        if (s.life <= 0) splashes.splice(i, 1)
      }

      if (!reduceMotion) frame = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="rain" aria-hidden="true" />
}
