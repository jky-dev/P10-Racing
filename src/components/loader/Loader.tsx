import { CircularProgress, Typography } from '@mui/material'
import React from 'react'

import styles from './Loader.module.scss'

interface LoaderProps {
  text?: string
}
const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className={styles.container}>
      <CircularProgress />
      <Typography variant="body1">{text ? text : 'Loading...'}</Typography>
    </div>
  )
}

export default Loader
