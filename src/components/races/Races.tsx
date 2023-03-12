import { Card, CardContent, Typography } from '@mui/material'
import React, { Key, useState } from 'react'
import Loader from '../loader/Loader'

const Races: React.FC = () => {
  const [races, setRaces] = useState([])
  const [raceResults, setRaceResults] = useState([])
  const [loading, setLoading] = useState(true)

  const init = async () => {
    setLoading(true)
    setRaces([])
    setRaceResults([])
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
                {raceResults[index]?.map((result: any) => (
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
