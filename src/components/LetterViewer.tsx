import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLang } from '../i18n/LangContext'
import { getCachedHtml, loadHtml, measureHtmlHeight, prefetchWork, works } from '../content/load'
import type { Work } from '../content/types'
import { CloseButton, Modal, PendingBadge } from './ui'

/**
 * Opens a circular the way an employee would see it: inside an email reader.
 * The circular itself stays in an isolated frame (sandbox="" : no scripts, no forms, no access to this site).
 * Sender details are generic placeholders, not real people.
 */
export default function LetterViewer({ state, onClose, onMove }: {
  state: { id: string; list: string[] } | null
  onClose: () => void
  onMove: (id: string) => void
}) {
  const { t, pick } = useLang()
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const work = state ? works.find((w) => w.id === state.id) : undefined
  const cached = work && work.format === 'html' ? getCachedHtml(work.dir, work.file) : undefined
  const [loaded, setLoaded] = useState<{ id: string; html: string } | null>(null)
  const html = cached ?? (loaded && work && loaded.id === work.id ? loaded.html : null)

  useEffect(() => {
    if (!work || work.format !== 'html' || cached !== undefined) return
    let live = true
    loadHtml(work.dir, work.file)
      .then((h) => live && setLoaded({ id: work.id, html: h }))
      .catch(() => live && setLoaded({ id: work.id, html: '' }))
    return () => {
      live = false
    }
  }, [work, cached])

  // while one circular is open, quietly prepare the previous and next ones
  useEffect(() => {
    if (!work || !state) return
    const l = state.list
    const i = l.indexOf(work.id)
    if (i < 0 || l.length < 2) return
    for (const id of [l[(i + 1) % l.length], l[(i - 1 + l.length) % l.length]]) {
      const w = works.find((x) => x.id === id)
      if (w) prefetchWork(w)
    }
  }, [work, state])

  const list = state?.list ?? []
  const idx = work ? list.indexOf(work.id) : -1
  const move = (d: number) => list.length && onMove(list[(idx + d + list.length) % list.length])
  const subject = work ? `${pick(work.kicker)}: ${pick(work.title)}` : ''

  return (
    <Modal open={!!work} onClose={onClose} label={subject} wide>
      {work && (
        <>
          {/* mail app toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex items-center gap-3">
              <CloseButton onClick={onClose} label={t.letters.close} />
              <span className="flex items-center gap-2 text-sm text-muted">
                <MailIcon /> {t.mail.inbox}
                {list.length > 1 && (
                  <bdi dir="ltr" className="text-xs">
                    {idx + 1} / {list.length}
                  </bdi>
                )}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div role="group" aria-label={t.letters.device} className="flex overflow-hidden rounded-full border-2 border-text">
                {(['desktop', 'mobile'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDevice(d)}
                    aria-pressed={device === d}
                    className={`min-h-[42px] cursor-pointer px-3.5 text-sm ${device === d ? 'bg-ink text-bg' : 'text-text'}`}
                  >
                    {t.letters[d]}
                  </button>
                ))}
              </div>
              {list.length > 1 && (
                <>
                  <ToolButton onClick={() => move(-1)}>{t.letters.prev}</ToolButton>
                  <ToolButton onClick={() => move(1)}>{t.letters.next}</ToolButton>
                </>
              )}
            </div>
          </div>

          {device === 'desktop' ? (
            <div className="overflow-hidden rounded-lg bg-[#f6f6f4] text-[#1d1f21]">
              <MailHeader work={work} subject={subject} />
              <div className="border-t border-[#e3e2dd] bg-[#efeeea] px-2 pt-5 pb-0 sm:px-5">
                <MailBody work={work} html={html} width={640} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center rounded-lg bg-[#2a2d30] px-3 py-6">
              <div className="w-[min(100%,395px)] overflow-hidden rounded-[38px] border-[10px] border-[#0f1011] bg-[#f6f6f4] text-[#1d1f21] shadow-2xl">
                <div aria-hidden="true" className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-[#0f1011]" />
                <MailHeader work={work} subject={subject} compact />
                <div className="border-t border-[#e3e2dd] bg-[#efeeea] pt-2 pb-0">
                  <MailBody work={work} html={html} width={375} />
                </div>
              </div>
            </div>
          )}

          {/* portfolio context */}
          <div className="flex flex-col gap-1">
            <span className="flex flex-wrap items-center gap-2 text-[15px]">
              {pick(work.description)} <PendingBadge show={work.pending} />
            </span>
            {work.role && (
              <span className="text-[15px]">
                <span className="text-brand-light">{t.letters.role}: </span>
                {pick(work.role)}
              </span>
            )}
            <span className="text-sm text-muted">{t.letters.note}</span>
          </div>
        </>
      )}
    </Modal>
  )
}

function MailHeader({ work, subject, compact }: { work: Work; subject: string; compact?: boolean }) {
  const { t, pick } = useLang()
  return (
    <div className={`flex flex-col gap-3 ${compact ? 'px-4 pt-3 pb-3' : 'px-6 pt-5 pb-4'}`}>
      <h3 className={`m-0 font-bold leading-snug ${compact ? 'text-[17px]' : 'text-[22px]'}`}>
        <span className="sr-only">{t.mail.subject}: </span>
        {subject}
      </h3>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-ink">
            <MailIcon />
          </span>
          <div className="flex min-w-0 flex-col text-sm leading-snug">
            <span>
              <span className="text-[#6b6f73]">{t.mail.from}: </span>
              <b>{t.mail.senderName}</b>{' '}
              {!compact && (
                <bdi dir="ltr" className="text-[#6b6f73]">
                  &lt;{t.mail.senderAddress}&gt;
                </bdi>
              )}
            </span>
            <span className="text-[#6b6f73]">
              {t.mail.to}: {t.mail.toValue}
            </span>
          </div>
        </div>
        {!compact && (
          <div className="flex shrink-0 gap-1.5">
            {[t.mail.reply, t.mail.forward].map((l) => (
              <button
                key={l}
                type="button"
                disabled
                title={t.mail.disabled}
                aria-label={`${l} (${t.mail.disabled})`}
                className="cursor-not-allowed rounded-full border border-[#d6d4ce] px-3 py-1.5 text-xs text-[#8a8d90]"
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>
      <span className="sr-only">{pick(work.title)}</span>
    </div>
  )
}

function MailBody({ work, html, width }: { work: Work; html: string | null; width: number }) {
  const { pick } = useLang()
  if (work.format === 'image')
    return (
      <div className="mx-auto" style={{ maxWidth: width }}>
        <img src={work.imageUrl} alt={pick(work.title)} className="block w-full" />
      </div>
    )
  return <FitFrame width={width} title={pick(work.title)} html={html} mkey={work.id} />
}

// Runs inside the email frame and reports where the email really ends (in the visitor's own browser,
// with the visitor's own fonts), so the frame ends exactly at the last element: no gap, no crop.
const HEIGHT_REPORTER =
  "<script>(function(){function s(){var b=document.body;if(!b)return;var m=0;for(var i=0;i<b.children.length;i++){var r=b.children[i].getBoundingClientRect();if(r.height>0&&r.bottom>m)m=r.bottom}" +
  "parent.postMessage({__aaEmailH:m+window.scrollY},'*')}addEventListener('load',s);if(document.fonts)document.fonts.ready.then(s);" +
  "if(window.ResizeObserver)new ResizeObserver(s).observe(document.body);setTimeout(s,0)})()<\/script>"

/** The circular's own scripts and inline handlers are removed; only the height reporter above runs. */
function prepareForFrame(html: string): string {
  const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, '')
  return /<\/body>/i.test(clean) ? clean.replace(/<\/body>/i, HEIGHT_REPORTER + '</body>') : clean + HEIGHT_REPORTER
}

/**
 * Shows the whole 640px email, scaled to the reading width, ending exactly at its last element.
 * The frame is isolated: sandbox="allow-scripts" WITHOUT allow-same-origin, so it cannot touch this page,
 * cookies or storage; it can only send its height. No forms, no popups, no navigation.
 */
export function FitFrame({ width, title, html, mkey }: { width: number; title: string; html: string | null; mkey: string }) {
  const outer = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const [avail, setAvail] = useState(width)
  const [contentH, setContentH] = useState<number | null>(null)
  const srcDoc = useMemo(() => (html ? prepareForFrame(html) : null), [html])
  useLayoutEffect(() => {
    const el = outer.current
    if (!el) return
    const ro = new ResizeObserver(() => setAvail(el.clientWidth))
    ro.observe(el)
    setAvail(el.clientWidth)
    return () => ro.disconnect()
  }, [])
  useEffect(() => {
    let live = true
    setContentH(null)
    // quick first estimate while the frame loads; replaced by the exact height the frame reports
    if (html) measureHtmlHeight(mkey, html).then((h) => live && setContentH((c) => c ?? h))
    const onMsg = (e: MessageEvent) => {
      if (e.source && e.source === frame.current?.contentWindow && typeof e.data?.__aaEmailH === 'number' && e.data.__aaEmailH > 0)
        setContentH(e.data.__aaEmailH)
    }
    window.addEventListener('message', onMsg)
    return () => {
      live = false
      window.removeEventListener('message', onMsg)
    }
  }, [html, mkey])
  const EMAIL = 640
  const boxW = Math.max(Math.min(width, avail), 240)
  const scale = boxW / EMAIL
  const h = contentH ?? 1400
  // snap the scaled height to whole device pixels so the last row is never a partial row
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const shownH = Math.floor(h * scale * dpr) / dpr
  return (
    <div ref={outer} className="flex w-full justify-center">
      <div className="relative block overflow-hidden" style={{ width: boxW, height: srcDoc === null ? 480 : shownH }}>
        {srcDoc === null ? (
          <div className="flex h-full items-center justify-center text-sm text-[#555]">…</div>
        ) : (
          <iframe
            ref={frame}
            title={title}
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            scrolling="no"
            srcDoc={srcDoc}
            className="absolute top-0 left-0 block border-0"
            style={{ width: EMAIL, height: h, transform: `scale(${scale})`, transformOrigin: '0 0' }}
          />
        )}
      </div>
    </div>
  )
}

function ToolButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="min-h-11 cursor-pointer rounded-full border-2 border-text px-3.5 text-sm text-text">
      {children}
    </button>
  )
}

function MailIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}
