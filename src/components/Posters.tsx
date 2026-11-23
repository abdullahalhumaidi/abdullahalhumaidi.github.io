import { useLang } from '../i18n/LangContext'
import { posters } from '../content/load'
import { PendingBadge, Reveal, SectionTitle } from './ui'

const LAYOUT = [
  'md:col-span-4 md:col-start-1 h-[470px] tilt-1',
  'md:col-span-3 md:col-start-5 md:mt-24 h-[340px] tilt-2',
  'md:col-span-5 md:col-start-8 md:mt-5 h-[410px] tilt-3',
  'md:col-span-5 md:col-start-2 h-[360px] tilt-4',
  'md:col-span-4 md:col-start-8 md:mt-16 h-[420px] tilt-1',
]

export default function Posters() {
  const { t, pick } = useLang()
  if (!posters.length) return null
  return (
    <section id="posters" className="mx-auto max-w-[1320px] px-6 pt-28 pb-10">
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle>{t.posters.title}</SectionTitle>
        <p className="m-0 max-w-[34ch] text-[17px]">{t.posters.intro}</p>
      </Reveal>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-12">
        {posters.map((p, i) => (
          <Reveal key={p.id} className={LAYOUT[i % LAYOUT.length].split(' ').filter((c) => c.startsWith('md:')).join(' ')}>
            <figure className={`lift relative m-0 flex flex-col justify-between overflow-hidden rounded border-2 border-line p-5 ${LAYOUT[i % LAYOUT.length].split(' ').filter((c) => !c.startsWith('md:')).join(' ')}`}>
              <img src={p.url} alt={pick(p.title)} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <span className="relative flex gap-2 self-start">
                <span className="rounded-full bg-bg/80 px-2.5 py-0.5 text-xs text-ink">{t.posters.tag}</span>
                <PendingBadge show={p.pending} />
              </span>
              <figcaption className="dsp relative self-start rounded bg-bg/80 px-3.5 pt-1 pb-2 text-[30px] text-ink">{pick(p.title)}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
