// Used ONLY in review builds (npm run dev:review / build:review).
// Reads /content-private, which is git-ignored and never published.
export const privMeta = import.meta.glob(
  ['/content-private/{works,ideas,posters}/*/meta.json', '/content-private/events/*/photos.json'],
  { eager: true, import: 'default' },
) as Record<string, unknown>

export const privAssets = import.meta.glob('/content-private/**/*.{jpg,jpeg,png,webp,gif,svg,ttf,woff,woff2,otf}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const privHtml = import.meta.glob('/content-private/**/*.html', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

export const privFontInline = import.meta.glob('/content-private/**/*.{ttf,otf,woff,woff2}', {
  query: '?inline',
  import: 'default',
}) as Record<string, () => Promise<string>>
