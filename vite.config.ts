import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'node:path'

/**
 * In a normal (publish) build, anything in /content whose "status" is not
 * "approved" is removed before it reaches the bundle. Nothing from
 * /content-private is ever included unless you build in "review" mode.
 */
function stripUnapproved(review: boolean): Plugin {
  const prune = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(prune).filter((x) => x !== undefined)
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>
      if ('status' in o && o.status !== 'approved') return undefined
      const out: Record<string, unknown> = {}
      for (const [k, val] of Object.entries(o)) {
        const p = prune(val)
        if (p !== undefined) out[k] = p
      }
      return out
    }
    return v
  }
  return {
    name: 'strip-unapproved-content',
    enforce: 'pre',
    transform(code, id) {
      if (review) return null
      const file = id.split('?')[0]
      if (!file.includes(`${path.sep}content${path.sep}`) || !file.endsWith('.json')) return null
      const data = JSON.parse(code)
      const pruned = prune(data) ?? (Array.isArray(data) ? [] : {})
      return { code: JSON.stringify(pruned), map: null }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const review = mode.startsWith('review')
  const single = mode.endsWith('single')
  return {
    base: env.VITE_BASE || '/',
    plugins: [stripUnapproved(review), react(), tailwindcss(), ...(single ? [viteSingleFile()] : [])],
    define: { __REVIEW__: JSON.stringify(review) },
    resolve: {
      alias: {
        '@private': path.resolve(__dirname, review ? 'src/content/private.review.ts' : 'src/content/private.empty.ts'),
      },
    },
    build: {
      outDir: single ? (review ? 'dist-review-single' : 'dist-single') : review ? 'dist-review' : 'dist',
      assetsInlineLimit: single ? 100_000_000 : 4096,
      chunkSizeWarningLimit: 4000,
    },
  }
})
