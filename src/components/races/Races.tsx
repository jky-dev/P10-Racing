import { Card, CardContent, Divider, Typography } from '@mui/material'
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

  const schedule = (race: RacesDbProps) => {
    const array = []
    array.push({
      name: 'Free Practice 1',
      date: new Date(`${race.fp1_date} ${race.fp1_time}`),
    })
    array.push({
      name: 'Free Practice 2',
      date: new Date(`${race.fp2_date} ${race.fp2_time}`),
    })
    array.push(
      race.fp3_date
        ? {
            name: 'Free Practice 3',
            date: new Date(`${race.fp3_date} ${race.fp3_time}`),
          }
        : {
            name: 'Sprint',
            date: new Date(`${race.sprint_date} ${race.sprint_time}`),
          }
    )
    array.push({
      name: 'Qualifying',
      date: new Date(`${race.quali_date} ${race.quali_time}`),
    })
    array.sort((a, b) => a.date.valueOf() - b.date.valueOf())
    return array.map((race) => (
      <>
        <Typography variant="h6">{race.name}</Typography>
        <Typography variant="body1">{race.date.toLocaleString()}</Typography>
      </>
    ))
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
                <Typography variant="h5">{raceName(race.race_name)}</Typography>
                <Divider sx={{ pt: 1, mb: 1 }} />
                {schedule(race)}
                <Typography variant="h6">Race Time</Typography>
                <Typography variant="body1">
                  {formatRaceDateTime(race.date, race.time)}
                </Typography>
                {raceResultsMap.get(race.id).length > 0 && (
                  <>
                    <Divider sx={{ pt: 1, mb: 1 }} />
                    <Typography variant="h6">Race Results</Typography>
                    {raceResultsMap.get(race.id).map((result) => (
                      <div className={styles.result} key={result.driver_id}>
                        <Typography variant="body1" key={result.position}>
                          {result.position}:{' '}
                          {driverName(
                            driversIdMap.get(result.driver_id),
                            '',
                            true
                          )}
                        </Typography>
                        <img
                          src={`/images/${
                            driversIdMap.get(result.driver_id).constructor
                          }.png`}
                          height="24"
                        />
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </span>
        ))}
      </div>
    </>
  )
}

export default Races
