import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'

import styles from './About.module.scss'

const About = () => {
  return (
    <div className={`${styles.container} fadeIn`}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        About
      </Typography>
      <Card sx={{ width: '100%', mb: 2 }} elevation={2}>
        <CardContent className={styles.cardContent}>
          <Typography variant="body1">
            Welcome to P10 Racing, the premier fantasy league for Formula 1 fans
            who love the thrill of the race and the strategic challenge of
            picking the perfect drivers.
          </Typography>
          <Typography variant="body1">
            At P10 Racing, we focus on the battle for the 10th position on the
            starting grid, the position that often goes overlooked in the
            excitement of the top spots. But for fantasy players, this position
            can make all the difference. That's why we've made it the heart of
            our game.
          </Typography>
          <Typography variant="body1">
            Our fantasy league is simple: players select the drivers they think
            will finish 10th in qualifying, and earn points based on how well
            their picks perform. But don't be fooled by the simplicity of the
            concept - the game is packed with strategic depth and excitement.
            Every race presents new challenges and opportunities, and players
            must stay on their toes to stay ahead of the competition.
          </Typography>
          <Typography variant="body1">
            At P10 Racing, we pride ourselves on providing an engaging and
            immersive experience for all our players. Our platform is designed
            to be intuitive and user-friendly, and our community is friendly and
            supportive. Whether you're a hardcore F1 fan or just getting
            started, you'll find a warm welcome here.
          </Typography>
          <Typography variant="body1">
            So why not join us today and put your F1 knowledge to the test? With
            P10 Racing, you'll experience the thrill of the race in a whole new
            way.
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default About
