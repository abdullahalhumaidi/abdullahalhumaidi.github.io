import { useLang } from '../i18n/LangContext'
import { site, works } from '../content/load'
import { Reveal, SectionTitle } from './ui'

/** "What can I bring to your team?": each capability points to one real example elsewhere on the page. */
export default function Offer({ onOpenWork }: { onOpenWork: (id: string, list: string[]) => void }) {
  const { t, pick } = useLang()
  return (
    <section id="offer" className="mx-auto max-w-[1320px] px-6 pt-24 pb-10">
      <Reveal className="mb-8">
        <SectionTitle>{t.offer.title}</SectionTitle>
      </Reveal>
      <Reveal>
        <ol className="m-0 grid list-none grid-cols-1 border-t border-line p-0 lg:grid-cols-2 lg:gap-x-12">
          {site.offer.map((o, i) => {
            const work = o.link?.type === 'work' ? works.find((w) => w.id === o.link!.target) : undefined
            const href = o.link && o.link.type !== 'work' ? (o.link.type === 'story' ? `#story-${o.link.target}` : `#${o.link.target}`) : undefined
            return (
              <li key={o.title.en} className="skill-row flex gap-4 border-b border-line py-5">
                <span className="min-w-7 pt-2 text-[13px] text-brand-light">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex flex-col gap-1.5">
                  <span className="dsp text-[clamp(22px,2.3vw,32px)] text-ink">{pick(o.title)}</span>
                  <span className="text-[15px]">{pick(o.example)}</span>
                  {work ? (
                    <button type="button" onClick={() => onOpenWork(work.id, [work.id])} className="min-h-11 cursor-pointer self-start bg-transparent p-0 text-start text-sm font-semibold text-brand-light underline underline-offset-4">
                      {t.offer.see}
                    </button>
                  ) : href ? (
                    <a href={href} className="inline-flex min-h-11 items-center self-start text-sm font-semibold underline underline-offset-4">
                      {t.offer.see}
                    </a>
                  ) : null}
                </span>
              </li>
            )
          })}
        </ol>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[15px]">
          <span className="text-muted">{t.offer.tools}:</span>
          <ul className="m-0 flex list-none flex-wrap items-baseline gap-x-2.5 gap-y-1 p-0" aria-label={t.offer.tools}>
            {site.tools.map((tool, i) => (
              <li key={tool} className="flex items-baseline gap-2.5 text-ink">
                <bdi dir="ltr">{tool}</bdi>
                {i < site.tools.length - 1 && <span aria-hidden="true" className="text-brand-light">·</span>}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
