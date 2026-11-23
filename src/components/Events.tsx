import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { events, loadHtml, posters, posts, prefetchWork, works } from '../content/load'
import type { Work } from '../content/types'
import type { Event } from '../content/types'
import { PendingBadge, Reveal, SectionTitle } from './ui'

/** Stories as a simple vertical set of cards: picture, title and my role up front; the rest is optional. */
export default function Events({ onOpenWork }: { onOpenWork: (id: string, list: string[]) => void }) {
  const { t } = useLang()
  if (!events.length) return null
  return (
    <section id="stories" className="mx-auto max-w-[1320px] px-6 pt-24 pb-10">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle>{t.events.title}</SectionTitle>
        <p className="m-0 max-w-[40ch] text-[17px]">{t.events.intro}</p>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((ev, i) => (
          <Reveal key={ev.id} delay={Math.min(i % 3, 2) * 0.06}>
            <StoryCard ev={ev} onOpenWork={onOpenWork} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const TONES = ['bg-navy', 'bg-brand', 'bg-soot']

function StoryCard({ ev, onOpenWork }: { ev: Event; onOpenWork: (id: string, list: string[]) => void }) {
  const { t, pick } = useLang()
  const [ph, setPh] = useState(0)
  const relWorks = works.filter((w) => ev.relatedWorks.includes(w.id))
  const listedWorks = ev.showWorks ? [] : relWorks
  const relPost = posts.find((p) => ev.relatedPosts.includes(p.id))
  const hasDesign = posters.some((p) => p.eventId === ev.id)
  const photo = ev.photos[Math.min(ph, ev.photos.length - 1)]
  return (
    <article id={`story-${ev.id}`} className="flex h-full scroll-mt-6 flex-col overflow-hidden rounded-lg border border-line bg-panel">
      {ev.showWorks && relWorks.length ? (
        <LiveDesigns list={relWorks} onOpenWork={onOpenWork} />
      ) : (
      <div className={`relative aspect-[4/3] overflow-hidden ${TONES[ev.order % 3]}`}>
        {photo ? (
          <>
            <img src={photo.url} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-xl" />
            <img src={photo.url} alt={pick(ev.title)} loading="lazy" className="relative block h-full w-full object-contain" />
          </>
        ) : (
          <span className="dsp absolute inset-0 flex items-end p-5 text-[40px] text-ink/70">{pick(ev.title)}</span>
        )}
        <span className="absolute start-3 top-3 flex flex-wrap gap-1.5">
          {ev.concept && <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-ink">{t.events.concept}</span>}
          <PendingBadge show={ev.photosPending} />
        </span>
        {ev.photos.length > 1 && (
          <span className="absolute end-3 bottom-3 rounded-full bg-bg/80 px-2.5 py-0.5 text-xs text-ink">
            <bdi dir="ltr">{ph + 1}/{ev.photos.length}</bdi> {t.events.photos}
          </span>
        )}
      </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {ev.roleType && (
          <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${ev.roleType === 'led' ? 'bg-ink text-bg' : 'border border-text text-text'}`}>
            {t.events.roleTypes[ev.roleType]}
          </span>
        )}
        <h3 className="dsp m-0 text-[clamp(26px,2.4vw,32px)] text-ink">{pick(ev.title)}</h3>
        <p className="m-0 text-[15px] font-semibold text-ink">{pick(ev.role)}</p>
        <p className="m-0 text-[15px]">{pick(ev.description)}</p>
        <details className="group mt-auto pt-2">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-brand-light">
            <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-90 rtl:-scale-x-100">›</span>
            {t.events.details}
          </summary>
          <div className="flex flex-col gap-3 pt-1 text-[15px]">
            {ev.how && (
              <p className="m-0">
                <span className="text-muted">{t.events.how}: </span>
                {pick(ev.how)}
              </p>
            )}
            {ev.comms && (
              <p className="m-0">
                <span className="text-muted">{t.events.comms}: </span>
                <span className="text-brand-light">{pick(ev.comms)}</span>
              </p>
            )}
            {ev.photos.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {ev.photos.map((p, k) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => setPh(k)}
                    aria-label={`${t.events.photo} ${k + 1}`}
                    aria-pressed={k === ph}
                    className="h-14 w-14 cursor-pointer overflow-hidden rounded-md border-2 bg-transparent p-0"
                    style={{ borderColor: k === ph ? 'var(--color-brand-light)' : 'transparent' }}
                  >
                    <img src={p.url} alt="" loading="lazy" className="block h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {(listedWorks.length > 0 || relPost || hasDesign) && (
              <div className="flex flex-wrap gap-2 text-sm">
                {listedWorks.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => onOpenWork(w.id, relWorks.map((x) => x.id))}
                    onPointerEnter={() => prefetchWork(w)}
                    className="min-h-10 cursor-pointer rounded-full border border-line px-3 text-ink hover:border-brand-light"
                  >
                    ✉ {pick(w.title)}
                  </button>
                ))}
                {hasDesign && (
                  <a href="#posters" className="inline-flex min-h-10 items-center rounded-full border border-line px-3 text-ink no-underline hover:border-brand-light">
                    {t.events.design}
                  </a>
                )}
                {relPost && (
                  <a href={relPost.url} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center rounded-full border border-line px-3 text-ink no-underline hover:border-brand-light">
                    {t.events.relatedPosts}: LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </details>
      </div>
    </article>
  )
}

/** The real HTML designs (not screenshots): a live, locked preview with a switch between them. */
function LiveDesigns({ list, onOpenWork }: { list: Work[]; onOpenWork: (id: string, list: string[]) => void }) {
  const { t, pick } = useLang()
  const [sel, setSel] = useState(0)
  const [html, setHtml] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [boxW, setBoxW] = useState(360)
  const box = useRef<HTMLDivElement>(null)
  const w = list[sel]
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setBoxW(el.clientWidth))
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: '300px' })
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])
  useEffect(() => {
    if (!visible) return
    let live = true
    setHtml(null)
    loadHtml(w.dir, w.file).then((h) => live && setHtml(h))
    return () => {
      live = false
    }
  }, [visible, w])
  const scale = boxW / 640
  return (
    <div>
      <div ref={box} className="relative aspect-[4/3] overflow-hidden bg-[#f4efe9]">
        {html && (
          <iframe
            title={pick(w.title)}
            sandbox=""
            scrolling="no"
            tabIndex={-1}
            srcDoc={html}
            className="pointer-events-none absolute top-0 left-0 border-0"
            style={{ width: 640, height: (boxW * 0.75) / scale, transform: `scale(${scale})`, transformOrigin: '0 0' }}
          />
        )}
        <button
          type="button"
          onClick={() => onOpenWork(w.id, list.map((x) => x.id))}
          onPointerEnter={() => prefetchWork(w)}
          aria-label={`${t.events.openDesign}: ${pick(w.title)}`}
          className="absolute inset-0 flex cursor-zoom-in items-end justify-start border-0 bg-gradient-to-t from-black/45 to-transparent to-40% p-3"
        >
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-bg">✉ {t.events.openDesign}</span>
        </button>
        <span className="absolute start-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-ink">{t.events.liveHtml}</span>
      </div>
      <div role="group" aria-label={t.events.liveHtml} className="flex flex-wrap gap-1.5 border-b border-line px-4 py-3">
        {list.map((x, i) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setSel(i)}
            aria-pressed={i === sel}
            className={`min-h-9 cursor-pointer rounded-full px-3 text-xs ${i === sel ? 'bg-ink text-bg' : 'border border-line text-text'}`}
          >
            {pick(x.title)}
          </button>
        ))}
      </div>
    </div>
  )
}
