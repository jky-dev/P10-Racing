import { Typography } from '@mui/material'
import React from 'react'
import { InView } from 'react-intersection-observer'

import {
  SupabaseContextProps,
  useSupabaseContext,
} from '../../contexts/SupabaseContext'
import { RacesDbProps } from '../../interfaces'
import styles from './Schedule.module.scss'
import ScheduleCard from './ScheduleCard/ScheduleCard'

const Schedule: React.FC = () => {
  const { races: allRaces }: SupabaseContextProps = useSupabaseContext()

  const races = allRaces.filter((race) => race.year === 2024)

  const onChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      entry.target.classList.add('fadeIn')
    }
  }

  const passedRaceDate = (race: RacesDbProps) => {
    const raceDate = Date.parse(`${race.date} ${race.time}`)
    return raceDate < Date.now()
  }

  const nextRaceIndex = races.findIndex((race) => !passedRaceDate(race))

  return (
    <div className={'fadeIn'}>
      {nextRaceIndex !== -1 && (
        <>
          <div className={styles.heading}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Upcoming Race Schedule
            </Typography>
          </div>
          <div className={styles.racesContainer}>
            {races.slice(nextRaceIndex, undefined).map((race) => (
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
        </>
      )}
      <div className={styles.heading}>
        <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>
          Past Race Schedule
        </Typography>
      </div>
      <div className={styles.racesContainer}>
        {races.slice(0, nextRaceIndex).map((race) => (
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
