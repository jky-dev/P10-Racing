import { Card, CardContent, Typography } from '@mui/material'
import React, { Key, useState } from 'react'
import { RaceResult, RacesProps } from '../../interfaces'
import { fetchPath } from '../../services/database'
import Loader from '../loader/Loader'

const Races: React.FC = () => {
  const [races, setRaces] = useState<null | RacesProps[]>(null)
  const [raceResults, setRaceResults] = useState<null | RaceResult[][]>(null)
  const [loading, setLoading] = useState(true)

  const init = async () => {
    setLoading(true)
    const dbRaces: Array<RacesProps> = await fetchPath('races')
    const dbResults: Array<Array<RaceResult>> = await fetchPath('results')
    setRaces(dbRaces)
    setRaceResults(dbResults)
    setLoading(false)
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        races.map((v, index) => (
          <span key={v.round as Key}>
            <Card variant="outlined" sx={{ width: '300px' }}>
              <CardContent>
                <Typography variant="h6">{v.raceName}</Typography>
                <Typography variant="body1">Results</Typography>
                {raceResults[index]?.map((result) => (
                  <Typography variant="body2" key={result.position}>
                    {result.position}: {result.Driver.givenName}{' '}
                    {result.Driver.familyName}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </span>
        ))
      )}
    </>
  )
}

export default Races
