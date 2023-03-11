import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './src/App'
import { ContextProvider } from './src/contexts/Context'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <ContextProvider>
    <App />
  </ContextProvider>
)
