export interface Box {
  /** center */
  x: number
  y: number
  w: number
  h: number
}

export interface ElbowWire {
  d: string
  start: { x: number; y: number }
  end: { x: number; y: number }
}

/**
 * Elbow ("circuit") connector between two boxes.
 * Leaves from the middle of the side of `a` facing `b` and arrives at the
 * opposite side of `b`, bending once halfway.
 */
export function elbowWire(a: Box, b: Box): ElbowWire {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const gapX = Math.abs(dx) - (a.w + b.w) / 2
  const gapY = Math.abs(dy) - (a.h + b.h) / 2

  if (gapX >= gapY) {
    // horizontal: right/left sides
    const dir = Math.sign(dx) || 1
    const x1 = a.x + (dir * a.w) / 2
    const x2 = b.x - (dir * b.w) / 2
    const mx = Math.round((x1 + x2) / 2)
    return {
      d: `M ${x1} ${a.y} H ${mx} V ${b.y} H ${x2}`,
      start: { x: x1, y: a.y },
      end: { x: x2, y: b.y },
    }
  }

  // vertical: bottom/top sides
  const dir = Math.sign(dy) || 1
  const y1 = a.y + (dir * a.h) / 2
  const y2 = b.y - (dir * b.h) / 2
  const my = Math.round((y1 + y2) / 2)
  return {
    d: `M ${a.x} ${y1} V ${my} H ${b.x} V ${y2}`,
    start: { x: a.x, y: y1 },
    end: { x: b.x, y: y2 },
  }
}
