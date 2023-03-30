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
import RaceResults from './components/raceResults/RaceResults'
import ResetPassword from './components/resetPassword/ResetPassword'
import Schedule from './components/schedule/Schedule'

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
        path: 'results',
        element: <RaceResults />,
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
          <ProtectedRoute admin>
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
      {
        path: 'reset',
        element: <ResetPassword />,
        errorElement: <GenericError />,
      },
      {
        path: 'schedule',
        element: <Schedule />,
        errorElement: <GenericError />,
      },
    ],
  },
])
