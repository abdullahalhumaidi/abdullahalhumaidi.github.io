import { useLang } from '../i18n/LangContext'
import { cvHref } from '../content/load'
import { site } from '../content/load'
import { PendingBadge, Reveal } from './ui'

export default function Contact() {
  const { t, pick } = useLang()
  const c = site.contact
  return (
    <footer id="contact" className="overflow-hidden bg-navy text-ink">
      <div aria-hidden="true" className="marquee-wrap bg-brand py-3.5 whitespace-nowrap text-ink">
        <div className="marquee dsp text-[34px]">
          {[0, 1].map((half) => (
            <div key={half} className="marquee-half">
              {[0, 1, 2].map((k) => (
                <span key={k} className="pe-10">{t.contact.marquee}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 px-6 pt-24 pb-16 md:grid-cols-12">
        <Reveal className="md:col-span-8">
          <h2 className="dsp m-0 text-[clamp(60px,10vw,170px)]">{t.contact.title}</h2>
        </Reveal>
        <Reveal className="flex flex-col justify-end gap-3.5 md:col-span-4" delay={0.1}>
          {c ? (
            <>
              <PendingBadge show={c.status !== 'approved'} />
              <a href={`mailto:${c.email}`} className="text-lg text-ink">
                <span className="block text-[13px] text-mist">{t.contact.email}</span>
                <bdi dir="ltr">{c.email}</bdi>
              </a>
              <a href={`tel:${c.phone}`} className="text-lg text-ink">
                <span className="block text-[13px] text-mist">{t.contact.phone}</span>
                <bdi dir="ltr">{c.phoneDisplay}</bdi>
              </a>
              <div className="flex flex-wrap gap-2.5">
                <a href={c.whatsapp} target="_blank" rel="noopener" className="rounded-full border-2 border-ink px-5 py-2.5 text-ink no-underline">
                  {t.contact.whatsapp}
                </a>
                <a href={c.linkedin} target="_blank" rel="noopener" className="rounded-full border-2 border-ink px-5 py-2.5 text-ink no-underline">
                  {t.contact.linkedin}
                </a>
              </div>
            </>
          ) : (
            <p className="m-0 text-mist">{t.contact.pending}</p>
          )}
          {site.cv && (
            <a href={cvHref(site.cv.url)} target="_blank" rel="noopener" className="self-start rounded-full bg-ink px-6 py-3 font-semibold text-bg no-underline hover:text-bg">
              {t.contact.cv}
            </a>
          )}
        </Reveal>
      </div>
      <div className="mx-auto max-w-[1320px] border-t border-[#3a4a66] px-6 py-6 text-sm text-mist">
        © {new Date().getFullYear()} {pick(site.name)}
      </div>
    </footer>
  )
}
