import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './data/characterRuntime'
import App from './App'
import './styles/global.css'
import './styles/releasePolish.css'
import './styles/characterIntegration.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
