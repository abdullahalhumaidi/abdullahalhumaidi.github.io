import { motion, useMotionValue, useSpring } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Soft green light behind the header and the intro.
 * Desktop: follows the mouse across the whole top area (header included), so there is no cut line.
 * Touch screens: a slow ambient drift instead (CSS, paused for "reduce motion").
 */
export default function GlowStage({ children }: { children: ReactNode }) {
  const x = useMotionValue(-999)
  const y = useMotionValue(-999)
  const sx = useSpring(x, { stiffness: 120, damping: 20 })
  const sy = useSpring(y, { stiffness: 120, damping: 20 })
  return (
    <div
      className="relative overflow-x-clip"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - r.left)
        y.set(e.clientY - r.top)
      }}
    >
      <motion.div
        aria-hidden="true"
        className="glow pointer-events-none absolute z-0 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
        style={{ left: sx, top: sy }}
      />
      <div aria-hidden="true" className="glow glow-ambient pointer-events-none absolute z-0 h-[420px] w-[420px] rounded-full md:hidden" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
