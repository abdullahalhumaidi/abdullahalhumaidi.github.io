// Checks the content folders before a build.
// - every record has Arabic AND English text
// - every file a record points to exists
// - nothing in /content (the publishable folder) is unapproved but still carrying files
// Run: npm run check:content
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const errors = []
const warnings = []
const rel = (p) => path.relative(root, p)

function walkBi(obj, where) {
  if (Array.isArray(obj)) return obj.forEach((v, i) => walkBi(v, `${where}[${i}]`))
  if (obj && typeof obj === 'object') {
    const keys = Object.keys(obj)
    if (keys.includes('ar') || keys.includes('en')) {
      if (!String(obj.ar ?? '').trim()) errors.push(`Missing Arabic text: ${where}`)
      if (!String(obj.en ?? '').trim()) errors.push(`Missing English text: ${where}`)
      return
    }
    for (const k of keys) walkBi(obj[k], `${where}.${k}`)
  }
}

function checkFolder(base, publishable) {
  for (const kind of ['works', 'ideas', 'posters', 'events']) {
    const dir = path.join(root, base, kind)
    if (!fs.existsSync(dir)) continue
    for (const id of fs.readdirSync(dir)) {
      const d = path.join(dir, id)
      if (!fs.statSync(d).isDirectory()) continue
      for (const name of ['meta.json', 'photos.json']) {
        const f = path.join(d, name)
        if (!fs.existsSync(f)) continue
        const m = JSON.parse(fs.readFileSync(f, 'utf8'))
        walkBi(m, rel(f))
        if (!['approved', 'pending'].includes(m.status)) errors.push(`${rel(f)}: status must be "approved" or "pending"`)
        for (const key of ['file', 'cover', 'app', 'image']) {
          if (m[key] && !fs.existsSync(path.join(d, m[key]))) errors.push(`${rel(f)}: file not found "${m[key]}"`)
        }
        for (const ph of m.photos ?? []) {
          if (!fs.existsSync(path.join(d, ph.file))) errors.push(`${rel(f)}: photo not found "${ph.file}"`)
        }
        const hasFiles = fs.readdirSync(d).some((x) => !x.endsWith('.json'))
        if (publishable && m.status !== 'approved' && hasFiles)
          errors.push(`${rel(d)} is not approved but sits in /content with files. Move it to /content-private until approved.`)
      }
    }
  }
}

for (const f of ['content/site.json', 'content/posts/posts.json', 'content/ui/ar.json']) {
  const p = path.join(root, f)
  if (fs.existsSync(p) && f !== 'content/ui/ar.json') walkBi(JSON.parse(fs.readFileSync(p, 'utf8')), f)
}

// UI dictionaries must have the same keys
const flat = (o, pre = '') =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? flat(v, `${pre}${k}.`) : [`${pre}${k}`]))
const ar = JSON.parse(fs.readFileSync(path.join(root, 'content/ui/ar.json'), 'utf8'))
const en = JSON.parse(fs.readFileSync(path.join(root, 'content/ui/en.json'), 'utf8'))
const ka = new Set(flat(ar))
const ke = new Set(flat(en))
for (const k of ka) if (!ke.has(k)) errors.push(`English UI text missing: ${k}`)
for (const k of ke) if (!ka.has(k)) errors.push(`Arabic UI text missing: ${k}`)

checkFolder('content', true)
checkFolder('content-private', false)
if (fs.existsSync(path.join(root, 'content-private'))) warnings.push('content-private exists locally (fine). It is git-ignored and only used by review builds.')

warnings.forEach((w) => console.log('note:', w))
if (errors.length) {
  console.error('\nContent check failed:\n- ' + errors.join('\n- '))
  process.exit(1)
}
console.log('Content check passed.')
