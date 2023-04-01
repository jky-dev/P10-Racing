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
import ScheduleCard from './ScheduleCard/ScheduleCard'

const Schedule: React.FC = () => {
  const { races }: SupabaseContextProps = useSupabaseContext()

  const onChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      entry.target.classList.add('fadeIn')
    }
  }

  const onChangeList = (inView: boolean, entry: IntersectionObserverEntry) => {
    console.log(inView)
    if (inView) {
      Array.from(entry.target.children).forEach((child) =>
        child.classList.add(`fadeInListDelay`)
      )
      console.log(entry.target.children)
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
          <InView
            onChange={onChange}
            style={{ width: '100%' }}
            key={race.id}
            className="hidden"
          >
            <ScheduleCard race={race} />
          </InView>
        ))}
      </div>
    </div>
  )
}

export default Schedule
