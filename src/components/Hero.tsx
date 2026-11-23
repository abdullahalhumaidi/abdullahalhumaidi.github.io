import { motion } from 'motion/react'
import { useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { cvHref } from '../content/load'
import { site } from '../content/load'

type Frag = { label: string; href: string }

export default function Hero({ frags }: { frags: Frag[] }) {
  const { t, lang } = useLang()
  const [opened, setOpened] = useState(false)
  const fragStyles = ['bg-navy text-ink tilt-1', 'bg-brand text-ink tilt-2', 'bg-ink text-bg tilt-3', 'bg-brand-light text-bg tilt-4']

  return (
    <section
      id="top"
      className="relative mx-auto min-h-[680px] max-w-[1320px] px-6 pt-10 pb-20"
    >
      <div className="relative z-10 inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-line px-4 py-1.5 text-sm">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand-light" />
        {t.hero.notif}
      </div>

      <motion.h1
        key={lang}
        className="dsp relative z-10 mt-7 mb-0 text-ink"
        animate={{ fontSize: opened ? 'clamp(54px, 8vw, 128px)' : 'clamp(72px, 15vw, 240px)' }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {t.hero.words.map((w, i) => (
          <motion.span
            key={w + i}
            className="me-[0.22em] inline-block"
            initial={{ opacity: 0, y: -70, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.18, ease: [0.2, 0.9, 0.25, 1.15] }}
          >
            {w}
          </motion.span>
        ))}
      </motion.h1>

      {!opened ? (
        <div className="relative z-10 mt-9 flex flex-wrap items-center justify-between gap-8">
          <motion.p
            className="m-0 max-w-[34ch] text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {t.hero.teaser}
          </motion.p>
          <motion.button
            type="button"
            onClick={() => setOpened(true)}
            className="me-[8%] h-[168px] w-[168px] cursor-pointer rounded-full border-0 bg-brand p-5 text-lg font-semibold leading-snug text-ink"
            whileHover={{ scale: 1.08, rotate: -8 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.hero.open}
          </motion.button>
        </div>
      ) : (
        <div className="relative z-10 mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-9 md:col-start-2">
            {[t.hero.me1, t.hero.me2].map((line, i) => (
              <motion.p
                key={line}
                className={`dsp m-0 text-[clamp(40px,6.4vw,100px)] ${i ? 'text-brand-light' : 'text-ink'}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.2, duration: 0.8 }}
              >
                {line}
              </motion.p>
            ))}
          </div>
          <motion.div
            className="flex flex-col gap-5 md:col-span-5 md:col-start-7"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
          >
            <p className="m-0 max-w-[42ch] text-lg">{t.hero.sub}</p>
            <div className="flex flex-wrap gap-2.5">
              <a href={frags[0]?.href ?? "#stories"} className="rounded-full bg-ink px-6 py-3 font-medium text-bg no-underline hover:text-bg">
                {t.hero.ctaWork}
              </a>
              {site.cv && (
                <a
                  href={cvHref(site.cv.url)}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border-2 border-ink px-5 py-2.5 font-medium text-ink no-underline"
                >
                  {t.hero.ctaCv}
                </a>
              )}
              <a href="#contact" className="px-2 py-3 font-medium text-ink">
                {t.hero.ctaContact}
              </a>
            </div>
          </motion.div>
          <motion.div
            className="mt-4 flex flex-wrap gap-3 md:col-span-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {frags.map((f, i) => (
              <a
                key={f.href}
                href={f.href}
                className={`lift inline-block rounded-full border-2 border-text px-5 py-2.5 text-[17px] font-medium no-underline ${fragStyles[i % 4]}`}
              >
                {f.label}
              </a>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  )
}
