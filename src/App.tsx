import { createClient } from '@supabase/supabase-js'
import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import About from './components/about/About'
import AdminPanel from './components/admin_panel/AdminPanel'
import GenericError from './components/error/GenericError'
import Home from './components/home/Home'
import Leagues from './components/leagues/Leagues'
import Login from './components/login/Login'
import Logout from './components/logout/Logout'
import Races from './components/races/Races'

const init = () => {
  const supabaseUrl = 'https://msrqldgafbaagfcxbcyv.supabase.co'
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcnFsZGdhZmJhYWdmY3hiY3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg1OTE1NjYsImV4cCI6MTk5NDE2NzU2Nn0.5zGGuJVpBoYLUCr53Haz671UMJw0AtFAHJo9giqnYYA'
  const supabase = createClient(supabaseUrl, supabaseKey)
}

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
        element: <div>Coming soon</div>,
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
  init()

  return (
    <>
      <RouterProvider router={router} />
      <Outlet />
    </>
  )
}
export default App
