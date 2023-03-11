import { Typography } from '@mui/material'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import AdminPanel from './components/admin_panel/AdminPanel'
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

const App = () => {
  initFirebase()
  const [user] = useAuthState(getAuth())

  return (
    <>
      <Typography variant="h3">P10 Racing League</Typography>
      {user ? (
        <>
          <AdminPanel />
          <Logout />
        </>
      ) : (
        <Login />
      )}
      <Races />
    </>
  )
}
export default App
