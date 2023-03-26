import { Card, CardContent, Typography, useMediaQuery } from '@mui/material'
import React from 'react'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { formatRaceDateTime } from '../../helpers/helpers'
import QualiResultsTable from './QualiResultsTable/QualiResultsTable'
import styles from './Qualifying.module.scss'

const Qualifying: React.FC = () => {
  const { qualiResultsMap, racesMap } = useSupabaseContext()

  const getQualiDate = (raceId: number) => {
    return racesMap.get(raceId).quali_date
  }

  const getQualiTime = (raceId: number) => {
    return racesMap.get(raceId).quali_time
  }

  const isMobile = useMediaQuery('(max-width:600px)')

  return (
    <div className={`${styles.container} fadeIn`}>
      <Typography variant="h4">Qualifying Results</Typography>
      {Array.from(qualiResultsMap.entries()).map(([race_id, resultsArray]) => (
        <Card key={race_id} className={styles.card}>
          <CardContent>
            <div className={styles.cardTitle}>
              <Typography variant="h5">
                {racesMap.get(race_id).race_name}
              </Typography>
              <Typography variant="subtitle1">
                {formatRaceDateTime(
                  getQualiDate(race_id),
                  getQualiTime(race_id),
                  isMobile
                )}
              </Typography>
            </div>
            <QualiResultsTable qualiResults={resultsArray}></QualiResultsTable>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Qualifying
