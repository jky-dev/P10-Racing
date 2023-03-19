import { Card, CardContent, Typography } from '@mui/material'
import React, { Key } from 'react'
import {
  SupabaseContextProps,
  useSupabaseContext,
} from '../../contexts/SupabaseContext'
import { formatRaceDateTime } from '../../helpers/helpers'
import { RacesDbProps } from '../../interfaces'
import styles from './Races.module.scss'

const Races: React.FC = () => {
  const { raceResultsMap, races, driversIdMap, loading }: SupabaseContextProps =
    useSupabaseContext()

  const formatDateTime = (race: RacesDbProps) => {
    return formatRaceDateTime(race.date, race.time)
  }

  const raceName = (name: string) => {
    return name.split(' Grand Prix')[0]
  }

  return (
    <>
      <div className={styles.heading}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Races
        </Typography>
      </div>
      <div className={styles.container}>
        {races
          .sort((a, b) => a.round_number - b.round_number)
          .map((race) => (
            <span key={race.race_name as Key}>
              <Card variant="outlined" sx={{ width: '250px' }}>
                <CardContent>
                  <Typography variant="h6">
                    {raceName(race.race_name)}
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(race)}
                  </Typography>
                  <Typography variant="body1">Results</Typography>
                  {raceResultsMap
                    .get(race.id)
                    .sort((a, b) => a.position - b.position)
                    .map((result) => (
                      <Typography variant="body2" key={result.position}>
                        {result.position}:{' '}
                        {driversIdMap.get(result.driver_id).given_name}{' '}
                        {driversIdMap.get(result.driver_id).last_name}
                      </Typography>
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
