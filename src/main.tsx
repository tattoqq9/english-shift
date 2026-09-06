import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './data/characterRuntime'
import App from './App'
import './styles/global.css'
import './styles/releasePolish.css'
import './styles/characterIntegration.css'
import './styles/v060/tokens.css'
import './styles/v060/shell.css'
import './styles/v060/components.css'
import './styles/v060/today.css'
import './styles/v060/journey.css'
import './styles/v060/review.css'
import './styles/v060/storeDetail.css'
import './styles/v060/shiftExperience.css'
import './styles/v060/unifiedFlow.css'
import './styles/v060/finalPolish.css'
import './styles/v061/gameFeel.css'
import './styles/v062/retention.css'
import './styles/v063/audioAtmosphere.css'
import './styles/v062/buildReadability.css'
import './styles/v064/collection.css'
import './styles/v065/freeBuild.css'
import './styles/v065/sessionMode.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
