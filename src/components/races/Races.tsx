import { Card, CardContent, Typography } from '@mui/material'
import React, { Key } from 'react'
import {
  SupabaseContextProps,
  useSupabaseContext,
} from '../../contexts/SupabaseContext'
import { RacesDbProps } from '../../interfaces'

const Races: React.FC = () => {
  const { raceResultsMap, races, driversIdMap, loading }: SupabaseContextProps =
    useSupabaseContext()

  const formatDateTime = (race: RacesDbProps) => {
    return new Date(`${race.date} ${race.time}`).toLocaleString()
  }

  return (
    <>
      {races
        .sort((a, b) => a.round_number - b.round_number)
        .map((race) => (
          <span key={race.race_name as Key}>
            <Card variant="outlined" sx={{ width: '300px' }}>
              <CardContent>
                <Typography variant="h6">{race.race_name}</Typography>
                <Typography variant="body1">{formatDateTime(race)}</Typography>
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
    </>
  )
}

export default Races
