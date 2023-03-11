import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
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

const initFirebase = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyBOQxaCS43e4hmLye-U8n5VRnjVP0sfgzs',
    authDomain: 'p10racing-5e630.firebaseapp.com',
    projectId: 'p10racing-5e630',
    storageBucket: 'p10racing-5e630.appspot.com',
    messagingSenderId: '626860315606',
    appId: '1:626860315606:web:9403ffcfe1f82d68f7ca77',
    measurementId: 'G-XL232WQS4L',
    databaseURL:
      'https://p10racing-5e630-default-rtdb.asia-southeast1.firebasedatabase.app/',
  }

  const app = initializeApp(firebaseConfig)
  getDatabase(app)
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
  initFirebase()

  return (
    <>
      <RouterProvider router={router} />
      <Outlet />
    </>
  )
}
export default App
