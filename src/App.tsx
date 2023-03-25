import { ThemeProvider } from '@emotion/react'
import { CssBaseline, PaletteMode, createTheme } from '@mui/material'
import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import styles from './App.module.scss'
import ProtectedRoute from './ProtectedRoute'
import AdminPanel from './components/admin_panel/AdminPanel'
import GenericError from './components/error/GenericError'
import Home from './components/home/Home'
import Join from './components/join/Join'
import Landing from './components/landing/Landing'
import Leagues from './components/leagues/Leagues'
import Loader from './components/loader/Loader'
import Login from './components/login/Login'
import Logout from './components/logout/Logout'
import Profile from './components/profile/Profile'
import Races from './components/races/Races'
import { useSupabaseContext } from './contexts/SupabaseContext'
import { useUtilsContext } from './contexts/UtilsContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <GenericError />,
    children: [
      {
        path: '',
        element: <Landing />,
        errorElement: <GenericError />,
      },
      {
        path: 'races',
        element: <Races />,
        errorElement: <GenericError />,
      },
      {
        path: 'leagues',
        element: (
          <ProtectedRoute>
            <Leagues />
          </ProtectedRoute>
        ),
        errorElement: <GenericError />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        errorElement: <GenericError />,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        ),
        errorElement: <GenericError />,
      },
      {
        path: 'login',
        element: <Login />,
        errorElement: <GenericError />,
      },
      {
        path: 'logout',
        element: (
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        ),
        errorElement: <GenericError />,
      },
      { path: 'join', element: <Join />, errorElement: <GenericError /> },
      {
        path: 'join/:inviteCode',
        element: <Join />,
        errorElement: <GenericError />,
      },
    ],
  },
])

const App = () => {
  const { loading } = useSupabaseContext()
  const { SnackBar, theme } = useUtilsContext()

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loading ? (
          <div className={styles.container}>
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
