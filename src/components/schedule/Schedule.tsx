import {
  Card,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
} from '@mui/material'
import React from 'react'
import { InView, useInView } from 'react-intersection-observer'

import {
  SupabaseContextProps,
  useSupabaseContext,
} from '../../contexts/SupabaseContext'
import { formatRaceDateTime } from '../../helpers/helpers'
import { RacesDbProps } from '../../interfaces'
import styles from './Schedule.module.scss'

const Schedule: React.FC = () => {
  const { races }: SupabaseContextProps = useSupabaseContext()
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
    array.push({
      name: 'Race Start',
      date: new Date(`${race.date} ${race.time}`),
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

  const onChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      entry.target.classList.add('fadeIn')
    }
  }

  const onChangeList = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      Array.from(entry.target.children).forEach((child) =>
        child.classList.add(`fadeInListDelay`)
      )
    }
  }

  return (
    <div className={'fadeIn'}>
      <div className={styles.heading}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Schedule
        </Typography>
      </div>
      <div className={styles.racesContainer}>
        {races.map((race) => (
          <InView onChange={onChange} style={{ width: '100%' }} key={race.id}>
            <Card sx={{ width: '100%' }} elevation={2}>
              <InView onChange={onChangeList}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5">{race.race_name}</Typography>
                  <Divider sx={{ pt: 1, mb: 1 }} />
                  {schedule(race)}
                </CardContent>
              </InView>
            </Card>
          </InView>
        ))}
      </div>
    </div>
  )
}

export default Schedule
