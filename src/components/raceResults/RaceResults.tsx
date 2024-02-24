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

  const onChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      entry.target.classList.add('fadeIn')
    }
  }

  const passedRaceDate = (race: RacesDbProps) => {
    const raceDate = Date.parse(`${race.date} ${race.time}`)
    return raceDate < Date.now()
  }

  const indexOfNextRace = races.findIndex((race) => !passedRaceDate(race))

  return (
    <div className={'fadeIn'}>
      {indexOfNextRace !== 0 && (
        <div className={styles.heading}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Race Results
          </Typography>
        </div>
      )}
      <div className={styles.container}>
        {races
          .slice(0, indexOfNextRace)
          .reverse()
          .map((race) => (
            <InView
              onChange={onChange}
              style={{ width: '100%' }}
              key={race.id}
              className="hidden"
            >
              <Card sx={{ width: '100%' }} elevation={2}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                  <div className={styles.raceTitle}>
                    <Typography variant="h5">{race.race_name}</Typography>
                    <Typography variant="subtitle1">
                      {formatRaceDateTime(race.date, race.time, isMobile)}
                    </Typography>
                  </div>
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
      {indexOfNextRace !== -1 && (
        <>
          <div className={styles.heading}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Upcoming Race Results
            </Typography>
          </div>
          <div className={styles.container}>
            {races.slice(indexOfNextRace, undefined).map((race) => (
              <InView
                onChange={onChange}
                style={{ width: '100%' }}
                key={race.id}
                className="hidden"
              >
                <Card sx={{ width: '100%' }} elevation={2}>
                  <CardContent>
                    <div className={styles.raceTitle}>
                      <Typography variant="h5">{race.race_name}</Typography>
                      <Typography variant="subtitle1">
                        {formatRaceDateTime(race.date, race.time, isMobile)}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </InView>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default RaceResults
