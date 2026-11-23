import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import ar from '../../content/ui/ar.json'
import en from '../../content/ui/en.json'
import type { Bi, Lang } from '../content/types'

export type UI = typeof ar
const DICT: Record<Lang, UI> = { ar, en: en as UI }
const KEY = 'aa-portfolio-lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    /* storage unavailable: fall back to Arabic */
  }
  return 'ar'
}

type Ctx = { lang: Lang; dir: 'rtl' | 'ltr'; t: UI; setLang: (l: Lang) => void; pick: (b: Bi | null | undefined) => string }
const LangContext = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const t = DICT[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const html = document.documentElement
    html.lang = lang
    html.dir = dir
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.meta.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.meta.description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'ar' ? 'ar_SA' : 'en_US')
  }, [lang, dir, t])

  const value = useMemo<Ctx>(
    () => ({
      lang,
      dir,
      t,
      setLang: (l) => {
        setLangState(l)
        try {
          localStorage.setItem(KEY, l)
        } catch {
          /* ignore */
        }
      },
      pick: (b) => (b ? b[lang] || b.ar : ''),
    }),
    [lang, dir, t],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const c = useContext(LangContext)
  if (!c) throw new Error('useLang must be used inside LangProvider')
  return c
}
