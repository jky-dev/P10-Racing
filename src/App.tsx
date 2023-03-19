import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import styles from './App.module.scss'
import About from './components/about/About'
import AdminPanel from './components/admin_panel/AdminPanel'
import GenericError from './components/error/GenericError'
import Home from './components/home/Home'
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
        element: <About />,
        errorElement: <GenericError />,
      },
      {
        path: 'races',
        element: <Races />,
        errorElement: <GenericError />,
      },
      {
        path: 'leagues',
        element: <Leagues />,
        errorElement: <GenericError />,
      },
      {
        path: 'profile',
        element: <Profile />,
        errorElement: <GenericError />,
      },
      {
        path: 'admin',
        element: <AdminPanel />,
        errorElement: <GenericError />,
      },
      {
        path: 'login',
        element: <Login />,
        errorElement: <GenericError />,
      },
      {
        path: 'logout',
        element: <Logout />,
        errorElement: <GenericError />,
      },
    ],
  },
])

const App = () => {
  const { loading } = useSupabaseContext()
  const { SnackBar } = useUtilsContext()

  if (loading)
    return (
      <div className={styles.container}>
        <Loader />
      </div>
    )

  return (
    <>
      {<SnackBar />}
      <RouterProvider router={router} />
    </>
  )
}
export default App
