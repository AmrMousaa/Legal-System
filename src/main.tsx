import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FluentProvider } from '@fluentui/react-components'
import './index.css'
import App from './App.tsx'
import { legalTheme, palette } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={legalTheme} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: palette.pageBg }}>
      <App />
    </FluentProvider>
  </StrictMode>,
)
