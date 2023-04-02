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

  return (
    <div className={'fadeIn'}>
      <div className={styles.heading}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Race Results
        </Typography>
      </div>
      <div className={styles.container}>
        {races.map((race) => (
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
    </div>
  )
}

export default RaceResults
