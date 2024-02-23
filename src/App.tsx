import { ThemeProvider } from '@emotion/react'
import { CssBaseline, CssBaselineProps } from '@mui/material'
import { inject } from '@vercel/analytics'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

import styles from './App.module.scss'
import { router } from './Router'
import Loader from './components/loader/Loader'
import { useSupabaseContext } from './contexts/SupabaseContext'
import { useUtilsContext } from './contexts/UtilsContext'

const App = () => {
  const underConstruction = !window.location.href.includes('localhost')
  const { loading } = useSupabaseContext()
  const { SnackBar, theme } = useUtilsContext()
  inject()

  if (underConstruction)
    return (
      <>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div
            style={{
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p>
              P10 Racing is under construction for the 2024 season! We will be
              back soon.
            </p>
          </div>
        </ThemeProvider>
      </>
    )

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loading ? (
          <div className={styles.loadingContainer}>
            <Loader />
          </div>
        ) : (
          <>
            {<SnackBar />}
            <RouterProvider router={router} />
          </>
        )}
      </ThemeProvider>
    </>
  )
}
export default App
