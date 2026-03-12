import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './index.tsx'
import { AppProvider } from './AppProvider'
//import Report from './report.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <Index />
    </AppProvider>
  </StrictMode>,
)