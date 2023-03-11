import { Card, CardContent, Typography } from '@mui/material'
import React, { useState } from 'react'
import { RacesProps } from '../../interfaces'
import { fetchPath } from '../../services/database'
import { setRaceResultsByRound } from '../../services/f1'
import Loader from '../loader/Loader'

const Races: React.FC = () => {
  const [races, setRaces] = useState<null | RacesProps[]>(null)
  const [loading, setLoading] = useState(true)

  const init = async () => {
    setLoading(true)
    const dbRaces: Array<RacesProps> = await fetchPath('races')

    setRaces(dbRaces)
    setLoading(false)

    await setRaceResultsByRound(1)
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        races.map((v) => (
          <Card variant="outlined" sx={{ width: '300px' }}>
            <CardContent>
              <Typography variant="body1">{v.raceName}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </>
  )
}

export default Races
