import { Button, Typography } from '@mui/material'
import React from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import styles from './About.module.scss'

const About: React.FC = () => {
  const { user } = useSupabaseContext()

  return (
    <div className={styles.container}>
      <Typography variant="h3" className={styles.heading}>
        P10 Racing, the ultimate F1 fantasy league!
      </Typography>

      <div className={styles.button}>
        <Button variant="contained">
          {user ? 'Join a league' : 'Get started'}
        </Button>
      </div>

      <Typography variant="h6">
        P10 Racing is a unique F1 fantasy league where participants pick a
        driver every week that they think will finish P10, to earn the most
        points. It's a game of skill, strategy, and luck, where you can compete
        against other F1 fans from around the world.
      </Typography>

      <Typography variant="h6">How it works:</Typography>

      <Typography variant="body1">
        Each week, you pick a driver that you think will finish in P10 or as
        close to P10 as possible.
      </Typography>

      <Typography variant="body1">
        You earn points based on the difference between your chosen driver's
        finishing position and P10.
      </Typography>

      <Typography variant="body1">
        The closer your driver finishes to P10, the more points you earn. If
        your driver finishes in P10, you earn the maximum points.
      </Typography>

      <Typography variant="h6">
        It's that simple! But don't be fooled, predicting the outcome of a
        Formula 1 race is not easy. With multiple factors that can influence the
        result, such as weather, track conditions, and driver performance, it's
        a challenge that requires careful analysis and strategy.
      </Typography>

      <Typography variant="h6">
        Joining P10 Racing is easy. Simply sign up for an account and start
        playing. You can create or join leagues with your friends and family!
      </Typography>

      <Typography variant="h5">
        So what are you waiting for? Sign up now and start playing P10 Racing,
        the ultimate F1 fantasy league!
      </Typography>
    </div>
  )
}

export default About
