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
  const { loading } = useSupabaseContext()
  const { SnackBar, theme } = useUtilsContext()
  inject()

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
