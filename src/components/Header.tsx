import { useLang } from '../i18n/LangContext'
import { REVIEW, site } from '../content/load'

export default function Header() {
  const { t, lang, setLang, pick } = useLang()
  return (
    <>
      {REVIEW && <div className="bg-[#7a5c1e] px-4 py-1.5 text-center text-[13px] text-ink">{t.review.bar}</div>}
      <header className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-6 py-5">
        <a href="#top" className="flex flex-col no-underline">
          <span className="dsp relative self-start text-[26px] text-ink">
            {pick(site.name)}
            <span aria-hidden="true" className="absolute -start-[18px] bottom-2.5 h-3 w-3 rounded-[2px] bg-brand-light" />
          </span>
          <span className="text-[13px] font-medium text-text">{pick(site.role)}</span>
        </a>
        <div role="group" aria-label={t.lang.label} className="flex overflow-hidden rounded-full border-2 border-text">
          {(['ar', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              lang={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`min-h-[42px] cursor-pointer px-4 text-sm ${lang === l ? 'bg-ink text-bg' : 'bg-transparent text-ink'}`}
            >
              {t.lang[l]}
            </button>
          ))}
        </div>
      </header>
    </>
  )
}
