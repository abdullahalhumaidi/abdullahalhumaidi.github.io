import { useMemo, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { prefetchWork, works } from '../content/load'
import type { Work } from '../content/types'
import { PendingBadge, Pill, Reveal, SectionTitle } from './ui'

const LAYOUT = [
  { col: 'md:col-span-5 md:col-start-1', mt: 'md:mt-0', tilt: 'tilt-1', tone: 'bg-navy text-ink', flap: '#283a5a' },
  { col: 'md:col-span-4 md:col-start-7', mt: 'md:mt-24', tilt: 'tilt-2', tone: 'bg-brand text-ink', flap: 'var(--color-brand-2)' },
  { col: 'md:col-span-4 md:col-start-2', mt: 'md:mt-0', tilt: 'tilt-4', tone: 'bg-ink text-bg', flap: '#dad8cf' },
  { col: 'md:col-span-6 md:col-start-7', mt: 'md:mt-10', tilt: 'tilt-3', tone: 'bg-soot text-brand-light', flap: '#2a2d25' },
]

export default function Letters({ onOpen }: { onOpen: (id: string, list: string[]) => void }) {
  const { t, pick } = useLang()
  const [cat, setCat] = useState<'all' | Work['category']>('all')
  const cats = useMemo(() => Array.from(new Set(works.map((w) => w.category))), [])
  const list = works.filter((w) => cat === 'all' || w.category === cat)
  if (!works.length) return null
  return (
    <section id="messages" className="mx-auto max-w-[1320px] px-6 pt-28 pb-10">
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle>{t.letters.title}</SectionTitle>
        <p className="m-0 max-w-[36ch] text-[17px]">{t.letters.intro}</p>
      </Reveal>
      {cats.length > 1 && (
        <div role="group" aria-label={t.letters.title} className="mb-12 flex flex-wrap gap-2">
          <Pill active={cat === 'all'} onClick={() => setCat('all')}>
            {t.letters.all}
          </Pill>
          {cats.map((c) => (
            <Pill key={c} active={cat === c} onClick={() => setCat(c)}>
              {t.letters.cats[c]}
            </Pill>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-12">
        {list.map((w, i) => {
          const L = LAYOUT[i % LAYOUT.length]
          return (
            <Reveal key={w.id} className={`${L.col} ${L.mt}`}>
              <button
                type="button"
                onClick={() => onOpen(w.id, list.map((x) => x.id))}
                onPointerEnter={() => prefetchWork(w)}
                onPointerDown={() => prefetchWork(w)}
                onFocus={() => prefetchWork(w)}
                className={`lift ${L.tilt} ${L.tone} relative flex min-h-[380px] w-full cursor-pointer flex-col overflow-hidden rounded-md border-2 border-line p-0 text-start`}
              >
                <span aria-hidden="true" className="block h-[90px] w-full" style={{ background: L.flap, clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
                <span className="flex flex-1 flex-col gap-2 px-6 pt-4 pb-5">
                  <span className="flex items-center justify-between gap-2 text-[13px] opacity-90">
                    {pick(w.kicker)}
                    <PendingBadge show={w.pending} />
                  </span>
                  <span className="dsp text-[clamp(28px,3vw,40px)]">{pick(w.title)}</span>
                  <span className="mt-auto flex items-center justify-between gap-3 text-sm">
                    <span>{t.letters.open}</span>
                    <span className="rounded-full border-[1.5px] border-current px-2.5 text-xs">{w.format === 'html' ? 'HTML' : t.letters.image}</span>
                  </span>
                </span>
                {w.coverUrl && (
                  <img src={w.coverUrl} alt="" loading="lazy" className="mx-auto -mb-0.5 block h-[150px] w-[86%] rounded-t-[10px] border border-b-0 border-black/25 object-cover object-top" />
                )}
              </button>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
