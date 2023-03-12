import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import About from './components/about/About'
import AdminPanel from './components/admin_panel/AdminPanel'
import GenericError from './components/error/GenericError'
import Home from './components/home/Home'
import Leagues from './components/leagues/Leagues'
import Login from './components/login/Login'
import Logout from './components/logout/Logout'
import Races from './components/races/Races'

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
  return <RouterProvider router={router} />
}
export default App
