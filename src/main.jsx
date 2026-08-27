import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const CHUNK_RELOAD_KEY = 'garden:chunk-reload-at'
const CHUNK_RELOAD_COOLDOWN_MS = 10_000

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? 0)
  if (Date.now() - lastReload < CHUNK_RELOAD_COOLDOWN_MS) return
  sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()))
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
