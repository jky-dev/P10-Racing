import { Typography } from '@mui/material'
import React from 'react'

import styles from './Standings.module.scss'
import P10StandingsTable from './p10Standings/P10StandingsTable'

const Standings = () => {
  return (
    <div className={`${styles.container} fadeIn`}>
      <Typography variant="h4">P10 Standings</Typography>
      <P10StandingsTable />
      {/* <Typography variant="h4">F1 Standings</Typography>
      <Typography variant="h4">Constructors Standings</Typography> */}
    </div>
  )
}

export default Standings
