import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'
import About from './components/about/About'
import AdminPanel from './components/admin_panel/AdminPanel'
import GenericError from './components/error/GenericError'
import Home from './components/home/Home'
import Join from './components/join/Join'
import Landing from './components/landing/Landing'
import Leagues from './components/leagues/Leagues'
import Login from './components/login/Login'
import Logout from './components/logout/Logout'
import Profile from './components/profile/Profile'
import Qualifying from './components/qualifying/Qualifying'
import Races from './components/races/Races'

export const router = createBrowserRouter([
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
      { path: 'about', element: <About />, errorElement: <GenericError /> },
      {
        path: 'qualifying',
        element: <Qualifying />,
        errorElement: <GenericError />,
      },
    ],
  },
])