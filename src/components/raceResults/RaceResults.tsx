import {
  Card,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
} from '@mui/material'
import React from 'react'
import { InView } from 'react-intersection-observer'

import {
  SupabaseContextProps,
  useSupabaseContext,
} from '../../contexts/SupabaseContext'
import { formatRaceDateTime } from '../../helpers/helpers'
import { RacesDbProps } from '../../interfaces'
import styles from './RaceResults.module.scss'
import RaceResultsTable from './RaceResultsTable/RaceResultsTable'

const RaceResults: React.FC = () => {
  const { raceResultsMap, races }: SupabaseContextProps = useSupabaseContext()
  const isMobile = useMediaQuery('(max-width:600px)')

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
      <div className={styles.raceTimeContainer} key={race.name}>
        <Typography variant="subtitle1">{race.name}</Typography>
        <Typography variant="subtitle1">
          {formatRaceDateTime('', '', isMobile, race.date)}
        </Typography>
      </div>
    ))
  }

  const raceName = (name: string) => {
    return name.split(' Grand Prix')[0] + ' GP'
  }

  const onChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      entry.target.classList.add('fadeIn')
    }
  }

  return (
    <div className={'fadeIn'}>
      <div className={styles.heading}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Race Results
        </Typography>
      </div>
      <div className={styles.container}>
        {races.map((race) => (
          <InView onChange={onChange} style={{ width: '100%' }}>
            <Card sx={{ width: '100%' }} key={race.id} elevation={2}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <div className={styles.raceTitle}>
                  <Typography variant="h5">
                    {raceName(race.race_name)}
                  </Typography>
                  <Typography variant="subtitle1">
                    {formatRaceDateTime(race.date, race.time, isMobile)}
                  </Typography>
                </div>
                <Divider sx={{ pt: 1, mb: 1 }} />
                {schedule(race)}
                {raceResultsMap.get(race.id).length > 0 && (
                  <>
                    <Divider sx={{ pt: 1, mb: 1 }} />
                    <div className={styles.heading}>
                      <Typography variant="body1">Race Results</Typography>
                    </div>
                    <RaceResultsTable
                      raceResults={raceResultsMap.get(race.id)}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </InView>
        ))}
      </div>
    </div>
  )
}

export default RaceResults