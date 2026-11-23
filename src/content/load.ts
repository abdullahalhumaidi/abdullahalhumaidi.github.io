import siteJson from '../../content/site.json'
import postsJson from '../../content/posts/posts.json'
import { privAssets, privFontInline, privHtml, privMeta } from '@private'
import type {
  Event, EventMeta, Idea, IdeaMeta, PhotoSet, Post, PostMeta, Poster, PosterMeta, SiteData, Work, WorkMeta,
} from './types'

declare const __REVIEW__: boolean
export const REVIEW: boolean = __REVIEW__

const pubMeta = import.meta.glob(
  ['/content/{works,ideas,posters,events}/*/meta.json', '/content/events/*/photos.json'],
  { eager: true, import: 'default' },
) as Record<string, unknown>
const pubAssets = import.meta.glob('/content/**/*.{jpg,jpeg,png,webp,gif,svg,ttf,woff,woff2,otf}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
const pubHtml = import.meta.glob('/content/**/*.html', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

const allMeta: Record<string, unknown> = { ...pubMeta, ...privMeta }
const assets: Record<string, string> = { ...pubAssets, ...privAssets }
const htmlLoaders: Record<string, () => Promise<string>> = { ...pubHtml, ...privHtml }

const visible = (s: { status?: string }) => s.status === 'approved' || (REVIEW && s.status === 'pending')
const dirOf = (p: string) => p.slice(0, p.lastIndexOf('/'))
const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order

function entries<T>(re: RegExp): { path: string; meta: T }[] {
  return Object.entries(allMeta)
    .filter(([p]) => re.test(p))
    .map(([path, meta]) => ({ path, meta: meta as T }))
}

export const site = siteJson as unknown as SiteData

export const works: Work[] = entries<WorkMeta>(/\/works\/[^/]+\/meta\.json$/)
  .filter(({ meta }) => visible(meta))
  .map(({ path, meta }) => {
    const dir = dirOf(path)
    return {
      ...meta,
      dir,
      pending: meta.status !== 'approved',
      coverUrl: assets[`${dir}/${meta.cover}`] ?? '',
      imageUrl: meta.format === 'image' ? assets[`${dir}/${meta.file}`] : undefined,
    }
  })
  .sort(byOrder)

const photoSets = entries<PhotoSet>(/\/events\/[^/]+\/photos\.json$/).filter(({ meta }) => visible(meta))

function photosFor(eventId: string) {
  const out: { url: string; facesBlurred: boolean; pending: boolean }[] = []
  for (const { path, meta } of photoSets) {
    if (meta.eventId !== eventId) continue
    const dir = dirOf(path)
    for (const ph of meta.photos) {
      const url = assets[`${dir}/${ph.file}`]
      if (url) out.push({ url, facesBlurred: !!ph.facesBlurred, pending: meta.status !== 'approved' })
    }
  }
  return out
}

export const events: Event[] = entries<EventMeta>(/\/events\/[^/]+\/meta\.json$/)
  .filter(({ meta }) => visible(meta))
  .map(({ meta }) => {
    const ph = photosFor(meta.id)
    return {
      ...meta,
      pending: meta.status !== 'approved',
      photos: ph.map(({ url, facesBlurred }) => ({ url, facesBlurred })),
      photosPending: ph.some((p) => p.pending),
    }
  })
  .sort(byOrder)

export const posters: Poster[] = entries<PosterMeta>(/\/posters\/[^/]+\/meta\.json$/)
  .filter(({ meta }) => visible(meta))
  .map(({ path, meta }) => ({ ...meta, pending: meta.status !== 'approved', url: assets[`${dirOf(path)}/${meta.image}`] ?? '' }))
  .filter((p) => p.url)
  .sort(byOrder)

export const ideas: Idea[] = entries<IdeaMeta>(/\/ideas\/[^/]+\/meta\.json$/)
  .filter(({ meta }) => visible(meta))
  .map(({ path, meta }) => {
    const dir = dirOf(path)
    return { ...meta, dir, pending: meta.status !== 'approved', coverUrl: assets[`${dir}/${meta.cover}`] ?? '' }
  })
  .sort(byOrder)

export const posts: Post[] = (postsJson as unknown as PostMeta[])
  .filter(visible)
  .sort(byOrder)

// Fonts used inside circulars, as ready-made data URIs (prepared at build time, loaded only when needed).
const fontInline = {
  ...(import.meta.glob('/content/**/*.{ttf,otf,woff,woff2}', { query: '?inline', import: 'default' }) as Record<
    string,
    () => Promise<string>
  >),
  ...privFontInline,
}

const htmlCache = new Map<string, string>()
const htmlPending = new Map<string, Promise<string>>()

/** Already-prepared HTML, if this circular was opened or prefetched before (lets the viewer render instantly). */
export function getCachedHtml(dir: string, file: string, rewriteAssets = true): string | undefined {
  return htmlCache.get(`${rewriteAssets ? 'r' : 'n'}:${dir}/${file}`)
}

/** Loads an HTML file once, points its images at the bundled files and embeds its fonts. Cached after the first call. */
export function loadHtml(dir: string, file: string, rewriteAssets = true): Promise<string> {
  const key = `${rewriteAssets ? 'r' : 'n'}:${dir}/${file}`
  const done = htmlCache.get(key)
  if (done !== undefined) return Promise.resolve(done)
  let p = htmlPending.get(key)
  if (!p) {
    p = prepareHtml(dir, file, rewriteAssets).then((h) => {
      htmlCache.set(key, h)
      htmlPending.delete(key)
      return h
    })
    p.catch(() => htmlPending.delete(key))
    htmlPending.set(key, p)
  }
  return p
}

async function prepareHtml(dir: string, file: string, rewriteAssets: boolean): Promise<string> {
  const loader = htmlLoaders[`${dir}/${file}`]
  if (!loader) throw new Error(`HTML not found: ${dir}/${file}`)
  let html = await loader()
  if (!rewriteAssets) return html
  // 1) fonts: an isolated frame cannot load them by URL, so swap in the build-time data URI.
  //    The pattern is bounded (max 300 chars) so it stays fast even on very large files.
  const fontRefs = new Set<string>()
  html.replace(/url\((['"]?)([^'")]{1,300}?\.(?:ttf|otf|woff2?))\1\)/gi, (_m, _q, u: string) => {
    if (!/^(data:|https?:)/i.test(u)) fontRefs.add(u)
    return ''
  })
  for (const u of fontRefs) {
    const load = fontInline[`${dir}/${u.replace(/^\.\//, '')}`]
    if (load) html = html.split(u).join(await load())
  }
  // 2) images and other files: point relative paths at the bundled asset URLs.
  const fix = (rel: string) => {
    if (/^(https?:|data:|blob:|#|\/)/i.test(rel)) return rel
    return assets[`${dir}/${rel.replace(/^\.\//, '')}`] ?? rel
  }
  return html
    .replace(/(\s(?:src|background)=")([^"]{1,1024})(")/gi, (_m, a, url, b) => a + fix(url) + b)
    .replace(/(^|[^\w$.])url\((['"]?)([^'")]{1,1024})\2\)/g, (_m, pre, q, url) => `${pre}url(${q}${fix(url)}${q})`)
}

/** Warms a circular in the background (on hover/focus, or for the next/previous one), without opening it. */
export function prefetchWork(w: Work): void {
  if (w.format === 'image') {
    if (w.imageUrl) new Image().src = w.imageUrl
    return
  }
  loadHtml(w.dir, w.file)
    .then((h) => {
      void measureHtmlHeight(w.id, h)
      // ask the browser to fetch the circular's images now, so they are cached when the frame needs them
      for (const m of h.matchAll(/\s(?:src|background)="([^"]{1,1024})"/gi)) {
        if (!m[1].startsWith('data:')) new Image().src = m[1]
      }
    })
    .catch(() => {})
}

/** Local files (e.g. the CV in /public/cv) work under any GitHub Pages base path. */
export function cvHref(url: string): string {
  return /^https?:/i.test(url) ? url : `${import.meta.env.BASE_URL}${url.replace(/^\//, '')}`
}

const heightCache = new Map<string, number>()

/**
 * Height of a circular rendered at 640px, measured with an off-screen, script-free copy inside a
 * Shadow DOM. Works everywhere (including isolated previews), because it never reads the frame.
 */
export async function measureHtmlHeight(key: string, html: string, width = 640): Promise<number> {
  const cached = heightCache.get(key)
  if (cached) return cached
  const doc = new DOMParser().parseFromString(html, 'text/html') // parsed documents never run scripts
  doc.querySelectorAll('script, iframe, object, embed, link[rel="import"]').forEach((n) => n.remove())
  doc.querySelectorAll('*').forEach((el) => {
    for (const a of Array.from(el.attributes)) if (/^on/i.test(a.name)) el.removeAttribute(a.name)
  })
  const css = Array.from(doc.querySelectorAll('style'))
    .map((st) => st.textContent ?? '')
    .join('\n')
    .replace(/(^|[\s,}])body(?=[\s,{.:#[])/g, '$1.aa-body')
  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText = `position:absolute;left:-20000px;top:0;width:${width}px;visibility:hidden;pointer-events:none;contain:layout style`
  document.body.appendChild(host)
  const root = host.attachShadow({ mode: 'open' })
  root.innerHTML = `<style>${css}</style><div class="aa-body" style="${doc.body.getAttribute('style') ?? ''}">${doc.body.innerHTML}</div>`
  const imgs = Array.from(root.querySelectorAll('img'))
  await Promise.race([
    Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = i.onerror = () => r(null) })))),
    new Promise((r) => setTimeout(r, 3000)),
  ])
  const h = Math.ceil((root.querySelector('.aa-body') as HTMLElement).getBoundingClientRect().height) + 8
  host.remove()
  heightCache.set(key, h)
  return h
}
