import { useLang } from '../i18n/LangContext'
import { site } from '../content/load'
import { Reveal, SectionTitle } from './ui'

export default function Journey() {
  const { t, pick } = useLang()
  return (
    <section id="journey" className="mx-auto max-w-[1320px] px-6 pt-28 pb-10">
      <Reveal className="mb-8">
        <SectionTitle>{t.journey.title}</SectionTitle>
      </Reveal>
      <Reveal>
        <ol className="m-0 list-none border-t border-line p-0">
          {site.journey.map((j) => (
            <li
              key={j.role.en}
              className="skill-row grid grid-cols-1 items-baseline gap-x-10 gap-y-1 border-b border-line py-6 md:grid-cols-[180px_minmax(0,1.3fr)_minmax(0,1fr)]"
            >
              <span className="text-[15px] text-brand-light">{pick(j.when)}</span>
              <span className="dsp text-[clamp(22px,2.4vw,34px)] text-ink">{pick(j.role)}</span>
              <span className="text-[15px] text-muted">{pick(j.place)}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
