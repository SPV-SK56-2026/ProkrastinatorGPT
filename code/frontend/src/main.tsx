import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './index.tsx'
//import Report from './report.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Index />
  </StrictMode>,
)