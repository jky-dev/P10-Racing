import { Button, Typography } from '@mui/material'
import React, { Suspense } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import Loader from '../loader/Loader'
import styles from './Landing.module.scss'

const ThreeJSLanding = React.lazy(() => import('./ThreeJSLanding'))

const Landing: React.FC = () => {
  const { threeJsHome } = useUtilsContext()
  const { user } = useSupabaseContext()
  const navigate = useNavigate()

  const handleClick = () => {
    if (user) {
      navigate('/leagues')
    } else {
      navigate('/login')
    }
  }
  return threeJsHome ? (
    <Suspense fallback={<Loader />}>
      <ThreeJSLanding />
    </Suspense>
  ) : (
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
