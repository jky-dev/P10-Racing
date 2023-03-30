import {
  Card,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
} from '@mui/material'
import React from 'react'
import { useInView } from 'react-intersection-observer'

import { formatRaceDateTime } from '../../../helpers/helpers'
import { RacesDbProps } from '../../../interfaces'
import styles from './ScheduleCard.module.scss'

interface ScheduleCardProps {
  race: RacesDbProps
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ race }) => {
  const isMobile = useMediaQuery('(max-width:600px)')
  const { ref, inView, entry } = useInView()

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

  React.useEffect(() => {
    if (inView) {
      Array.from(entry.target.children).forEach((child) =>
        child.classList.add(`fadeInListDelay`)
      )
    }
  }, [inView])

  return (
    <Card sx={{ width: '100%' }} elevation={2}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5">{race.race_name}</Typography>
        <Divider sx={{ pt: 1, mb: 1 }} />
        <span ref={ref}>{schedule(race)}</span>
      </CardContent>
    </Card>
  )
}

export default ScheduleCard
