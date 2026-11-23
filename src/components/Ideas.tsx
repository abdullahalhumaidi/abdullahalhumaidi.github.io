import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { ideas, loadHtml } from '../content/load'
import { CloseButton, Modal, PendingBadge, Reveal, SectionTitle } from './ui'

const LAYOUT = [
  { col: 'md:col-span-7', mt: '', tone: 'bg-panel' },
  { col: 'md:col-span-5', mt: 'md:mt-24', tone: 'bg-navy' },
]

export default function Ideas() {
  const { t, pick } = useLang()
  const [open, setOpen] = useState<string | null>(null)
  const [html, setHtml] = useState<string | null>(null)
  const idea = ideas.find((i) => i.id === open)
  useEffect(() => {
    let live = true
    setHtml(null)
    if (idea) loadHtml(idea.dir, idea.app, false).then((h) => live && setHtml(withEscBridge(h)))
    return () => {
      live = false
    }
  }, [idea])
  useEffect(() => {
    if (!open) return
    const onMsg = (e: MessageEvent) => {
      if (e.data && e.data.__aaPortfolio === 'escape') setOpen(null)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [open])
  if (!ideas.length) return null
  return (
    <section id="ideas" className="mx-auto max-w-[1320px] px-6 pt-28 pb-10">
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle>{t.ideas.title}</SectionTitle>
        <p className="m-0 max-w-[36ch] text-[17px]">{t.ideas.intro}</p>
      </Reveal>
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
        {ideas.map((it, i) => {
          const L = LAYOUT[i % LAYOUT.length]
          return (
            <Reveal key={it.id} className={`${L.col} ${L.mt}`}>
              <article className={`flex flex-col overflow-hidden rounded-[10px] border-[1.5px] border-line ${L.tone}`}>
                <button type="button" onClick={() => setOpen(it.id)} aria-label={`${t.ideas.try}: ${pick(it.title)}`} className="block h-[320px] cursor-pointer overflow-hidden border-0 bg-[#0f1011] p-0">
                  <img src={it.coverUrl} alt="" loading="lazy" className="lift block h-full w-full object-cover object-top" />
                </button>
                <div className="flex flex-col gap-3 px-6 pt-6 pb-7">
                  <span className="flex items-center gap-2 text-[13px] text-mist">
                    {pick(it.kicker)} <PendingBadge show={it.pending} />
                  </span>
                  <h3 className="dsp m-0 text-[clamp(34px,4vw,56px)] text-ink">{pick(it.title)}</h3>
                  <p className="m-0 text-[17px]">{pick(it.description)}</p>
                  <ul className="m-0 mt-1 flex list-none flex-wrap gap-2 p-0">
                    {it.features.map((f) => (
                      <li key={f.en} className="rounded-full border border-[#5a5d52] px-3 py-1 text-sm">{pick(f)}</li>
                    ))}
                  </ul>
                  <span className="text-[13px] text-mist">{t.ideas.note}</span>
                  <button type="button" onClick={() => setOpen(it.id)} className="mt-1.5 min-h-11 cursor-pointer self-start rounded-full bg-ink px-7 font-semibold text-bg">
                    {t.ideas.try}
                  </button>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
      <Modal open={!!idea} onClose={() => setOpen(null)} label={idea ? pick(idea.title) : ''} wide>
        {idea && (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="dsp text-[28px] text-ink">{pick(idea.title)}</span>
                <span className="text-sm text-muted">{t.ideas.sandbox} {t.ideas.note}</span>
              </div>
              <CloseButton onClick={() => setOpen(null)} label={t.ideas.close} />
            </div>
            <div className="h-[78vh] overflow-hidden rounded-md bg-[#0f1011]">
              {html === null ? (
                <div className="flex h-full items-center justify-center text-sm text-muted">…</div>
              ) : (
                <iframe
                  title={pick(idea.title)}
                  sandbox="allow-scripts allow-forms"
                  referrerPolicy="no-referrer"
                  srcDoc={html}
                  className="block h-full w-full border-0"
                />
              )}
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}

/** Lets Esc pressed inside the isolated app close the viewer (the app cannot touch this page otherwise). */
function withEscBridge(html: string) {
  const bridge =
    "<script>window.addEventListener('keydown',function(e){if(e.key==='Escape'){try{parent.postMessage({__aaPortfolio:'escape'},'*')}catch(_){}}},true)</script>"
  return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => m + bridge) : bridge + html
}
