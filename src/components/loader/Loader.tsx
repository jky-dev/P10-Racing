import { CircularProgress, Typography } from '@mui/material'
import React from 'react'

import styles from './Loader.module.scss'

const Loader: React.FC = () => {
  return (
    <div className={styles.container}>
      <CircularProgress />
      <Typography variant="body1">Loading...</Typography>
    </div>
  )
}

export default Loader
