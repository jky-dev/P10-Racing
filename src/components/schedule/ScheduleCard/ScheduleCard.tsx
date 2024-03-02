import {
  Card,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
} from '@mui/material'
import React from 'react'

import { formatRaceDateTime } from '../../../helpers/helpers'
import { RacesDbProps } from '../../../interfaces'
import styles from './ScheduleCard.module.scss'

interface ScheduleCardProps {
  race: RacesDbProps
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ race }) => {
  const testNameSpace = 'schedule-card'
  const isMobile = useMediaQuery('(max-width:600px)')

  const schedule = (race: RacesDbProps) => {
    const array = []
    array.push({
      name: 'Free Practice 1',
      id: 'fp1',
      date: new Date(`${race.fp1_date} ${race.fp1_time}`),
    })
    array.push(
      race.fp2_date
        ? {
            name: 'Free Practice 2',
            id: 'fp2',
            date: new Date(`${race.fp2_date} ${race.fp2_time}`),
          }
        : {
            name: 'Sprint Qualifying',
            id: 'sq',
            date: new Date(
              `${race.sprint_quali_date} ${race.sprint_quali_time}`
            ),
          }
    )
    array.push(
      race.fp3_date
        ? {
            name: 'Free Practice 3',
            id: 'fp3',
            date: new Date(`${race.fp3_date} ${race.fp3_time}`),
          }
        : {
            name: 'Sprint',
            id: 's',
            date: new Date(`${race.sprint_date} ${race.sprint_time}`),
          }
    )
    array.push({
      name: 'Qualifying',
      id: 'q',
      date: new Date(`${race.quali_date} ${race.quali_time}`),
    })
    array.push({
      name: 'Race Start',
      id: 'r',
      date: new Date(`${race.date} ${race.time}`),
    })
    array.sort((a, b) => a.date.valueOf() - b.date.valueOf())
    return array.map((schedule) => (
      <div className={styles.raceTimeContainer} key={schedule.name}>
        <Typography
          variant="subtitle1"
          data-testid={`${testNameSpace}-${schedule.id}`}
        >
          {schedule.name}
        </Typography>
        <Typography
          variant="subtitle1"
          data-testid={`${testNameSpace}-${schedule.id}-time`}
        >
          {formatRaceDateTime('', '', isMobile, schedule.date)}
        </Typography>
      </div>
    ))
  }

  return (
    <Card sx={{ width: '100%' }} elevation={2}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5">{race.race_name}</Typography>
        <Divider sx={{ pt: 1, mb: 1 }} />
        {schedule(race)}
      </CardContent>
    </Card>
  )
}

export default ScheduleCard
