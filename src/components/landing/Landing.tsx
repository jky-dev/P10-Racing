import { Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import styles from './Landing.module.scss'
import ThreeJSLanding from './ThreeJSLanding'

const Landing: React.FC = () => {
  const { threeJsHome } = useUtilsContext()
  const { user, client } = useSupabaseContext()
  const navigate = useNavigate()

  const handleClick = () => {
    if (user) {
      navigate('/leagues')
    } else {
      client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
    }
  }

  if (threeJsHome) return <ThreeJSLanding />

  return (
    <span className={styles.container}>
      <div className={styles.heading}>
        <Typography
          variant="h1"
          textAlign="center"
          className={styles.title}
          sx={{}}
        >
          P10 Racing
        </Typography>
        <Typography
          component="span"
          variant="h6"
          textAlign="center"
          className={styles.subtitle}
        >
          The ultimate F1 fantasy league!
        </Typography>
      </div>
      <div className={styles.button}>
        <Button variant="outlined" onClick={handleClick}>
          {user ? 'Join a league' : 'Get started'}
        </Button>
      </div>
    </span>
  )
}

export default Landing
