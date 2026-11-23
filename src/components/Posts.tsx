import { useLang } from '../i18n/LangContext'
import { posts, site } from '../content/load'
import { Reveal, SectionTitle } from './ui'

/** LinkedIn posts as clean text cards: topic, how the post opens (quoted), and a clear link to the original. */
export default function Posts() {
  const { t, pick } = useLang()
  if (!posts.length) return null
  return (
    <section id="posts" className="mx-auto max-w-[1320px] px-6 pt-24 pb-10">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle>{t.posts.title}</SectionTitle>
        {site.contact?.linkedin && (
          <a href={site.contact.linkedin} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-full border-2 border-ink px-5 font-semibold text-ink no-underline">
            {t.posts.follow}
          </a>
        )}
      </Reveal>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Reveal key={p.id}>
            <article className="flex h-full flex-col gap-4 rounded-lg border border-line bg-panel p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold tracking-wide text-brand-light">LinkedIn</span>
                {p.eventId && (
                  <a href={`#story-${p.eventId}`} className="text-sm text-muted">
                    {t.posts.story}
                  </a>
                )}
              </div>
              <h3 className="dsp m-0 text-[clamp(24px,2.2vw,30px)] text-ink" style={{ lineHeight: 1.2 }}>{pick(p.topic)}</h3>
              <figure className="m-0 flex flex-col gap-1">
                <figcaption className="text-xs text-muted">{t.posts.from}</figcaption>
                <blockquote dir="auto" lang={p.excerptLang} className="m-0 border-s-2 border-brand-light ps-3 text-[16px] leading-relaxed text-text">
                  {p.excerpt}
                </blockquote>
              </figure>
              <a
                href={p.url}
                target="_blank"
                rel="noopener"
                className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 font-semibold text-bg no-underline hover:text-bg"
              >
                {t.posts.open}
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
