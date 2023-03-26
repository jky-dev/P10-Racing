import React, { Suspense } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import styles from './Home.module.scss'
import Navigation from './navigation/Navigation'

const Home: React.FC = () => {
  const navigate = useNavigate()

  const checkInvite = () => {
    const token = JSON.parse(localStorage.getItem('inviteToken'))

    if (!token) return

    if (token.time < new Date().valueOf()) {
      localStorage.removeItem('inviteToken')
      return
    }

    localStorage.removeItem('inviteToken')

    navigate('/join/' + token.code)
  }

  React.useEffect(() => {
    checkInvite()
  }, [])

  return (
    <div className={styles.container}>
      <Navigation />
      <div className={styles.layout}>
        <Outlet />
      </div>
    </div>
  )
}

export default Home
