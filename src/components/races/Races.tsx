import { Card, CardContent, Typography } from '@mui/material'
import React, { Key } from 'react'

import {
  SupabaseContextProps,
  useSupabaseContext,
} from '../../contexts/SupabaseContext'
import { driverName, formatRaceDateTime } from '../../helpers/helpers'
import { RacesDbProps } from '../../interfaces'
import styles from './Races.module.scss'

const Races: React.FC = () => {
  const { raceResultsMap, races, driversIdMap }: SupabaseContextProps =
    useSupabaseContext()

  const formatDateTime = (race: RacesDbProps) => {
    return formatRaceDateTime(race.date, race.time)
  }

  const raceName = (name: string) => {
    return name.split(' Grand Prix')[0] + ' GP'
  }

  return (
    <>
      <div className={styles.heading}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Races
        </Typography>
      </div>
      <div className={styles.container}>
        {races.map((race) => (
          <span key={race.race_name as Key}>
            <Card variant="outlined" sx={{ width: '250px' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6">{raceName(race.race_name)}</Typography>
                <Typography variant="body1">{formatDateTime(race)}</Typography>
                {raceResultsMap.get(race.id).length > 0 && (
                  <Typography variant="body1">Results</Typography>
                )}
                {raceResultsMap.get(race.id)!.map((result) => (
                  <div className={styles.result} key={result.driver_id}>
                    <Typography variant="body2" key={result.position}>
                      {result.position}:{' '}
                      {driverName(driversIdMap.get(result.driver_id), '', true)}
                    </Typography>
                    <img
                      src={`/images/${
                        driversIdMap.get(result.driver_id).constructor
                      }.png`}
                      height="20"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </span>
        ))}
      </div>
    </>
  )
}

export default Races
