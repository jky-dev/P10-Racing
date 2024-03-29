import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import Navigation from '../navigation/Navigation'
import styles from './Home.module.scss'

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

  const checkReset = () => {
    if (localStorage.getItem('reset')) {
      localStorage.removeItem('reset')
      navigate('/reset')
    }
  }

  React.useEffect(() => {
    checkInvite()
    checkReset()
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
