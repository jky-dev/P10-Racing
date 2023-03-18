import React from 'react'
import { Outlet } from 'react-router-dom'
import styles from './Home.module.scss'
import Navigation from './navigation/Navigation'

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Navigation />
      <div className={styles.layout}>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Home
