import { MotionConfig } from 'motion/react'
import { useCallback, useState } from 'react'
import { useLang } from './i18n/LangContext'
import { events, ideas, posts, works } from './content/load'
import Header from './components/Header'
import GlowStage from './components/GlowStage'
import Hero from './components/Hero'
import Letters from './components/Letters'
import LetterViewer from './components/LetterViewer'
import Events from './components/Events'
import Posters from './components/Posters'
import Ideas from './components/Ideas'
import Offer from './components/Offer'
import Journey from './components/Journey'
import Posts from './components/Posts'
import Contact from './components/Contact'

export default function App() {
  const { t, dir, lang } = useLang()
  const [viewer, setViewer] = useState<{ id: string; list: string[] } | null>(null)
  const open = useCallback((id: string, list: string[]) => setViewer({ id, list }), [])
  const frags = [
    events.length ? { label: t.hero.frags[0], href: '#stories' } : null,
    posts.length ? { label: t.hero.frags[1], href: '#posts' } : null,
    ideas.length ? { label: t.hero.frags[2], href: '#ideas' } : null,
    works.length ? { label: t.hero.frags[3], href: '#messages' } : null,
  ].filter((x): x is { label: string; href: string } => !!x)

  return (
    <MotionConfig reducedMotion="user">
      <div dir={dir} lang={lang} className="min-h-screen bg-bg text-text">
        <main>
          <GlowStage>
            <Header />
            <Hero frags={frags} />
          </GlowStage>
          <Offer onOpenWork={open} />
          <Events onOpenWork={open} />
          <Posts />
          <Posters />
          <Ideas />
          <Letters onOpen={open} />
          <Journey />
        </main>
        <Contact />
        <LetterViewer state={viewer} onClose={() => setViewer(null)} onMove={(id) => setViewer((v) => (v ? { ...v, id } : v))} />
      </div>
    </MotionConfig>
  )
}
