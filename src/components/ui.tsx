import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useLang } from '../i18n/LangContext'

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="dsp m-0 text-ink text-[clamp(52px,9vw,150px)]">
      {children}
    </h2>
  )
}

export function PendingBadge({ show }: { show: boolean }) {
  const { t } = useLang()
  if (!show) return null
  return (
    <span className="inline-block rounded-full bg-[#7a5c1e] px-3 py-0.5 text-xs font-semibold text-ink">{t.review.badge}</span>
  )
}

export function Modal({
  open,
  onClose,
  label,
  children,
  wide,
}: {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  wide?: boolean
}) {
  const panel = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<Element | null>(null)
  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setTimeout(() => panel.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 50)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      ;(lastFocus.current as HTMLElement | null)?.focus?.()
    }
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,16,17,0.84)] p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className={`flex max-h-[94vh] w-full flex-col gap-4 overflow-y-auto overscroll-contain rounded-lg border [&>*]:shrink-0 border-[#34372e] bg-panel p-4 text-text sm:p-6 ${wide ? 'max-w-[1200px]' : 'max-w-[1000px]'}`}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      data-autofocus
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink text-bg"
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M3 3l12 12M15 3L3 15" />
      </svg>
    </button>
  )
}

export function Pill({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean
  onClick: () => void
  children: ReactNode
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`min-h-11 cursor-pointer rounded-full border-2 border-text px-4 py-2 text-sm transition-colors ${
        active ? 'bg-ink text-bg' : 'bg-transparent text-text hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  )
}
