import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './src/App'
import { SupabaseProvider } from './src/contexts/SupabaseContext'
import { UtilsProvider } from './src/contexts/UtilsContext'

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <SupabaseProvider>
    <UtilsProvider>
      <App />
    </UtilsProvider>
  </SupabaseProvider>
)
