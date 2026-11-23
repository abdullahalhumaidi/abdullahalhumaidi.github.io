import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/lalezar'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/ibm-plex-sans-arabic/400.css'
import '@fontsource/ibm-plex-sans-arabic/500.css'
import '@fontsource/ibm-plex-sans-arabic/600.css'
import '@fontsource/ibm-plex-sans-arabic/700.css'
import './index.css'
import App from './App'
import { LangProvider } from './i18n/LangContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
)
