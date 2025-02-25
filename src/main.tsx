import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SeedProvider from './contexts/SeedContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SeedProvider>
      <App />
    </SeedProvider>
  </StrictMode>,
)
