import React from 'react'
import { Outlet } from 'react-router-dom'
import styles from './Home.module.scss'
import Navigation from './navigation/Navigation'

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Navigation />
      <div style={{ marginTop: '4rem' }}>
        <Outlet />
      </div>
    </div>
  )
}

export default Home
