import { Card, CardContent, Typography } from '@mui/material'
import React, { Key, useState } from 'react'
import { RacesProps } from '../../interfaces'
import { fetchPath } from '../../services/database'
import Loader from '../loader/Loader'

const Races: React.FC = () => {
  const [races, setRaces] = useState<null | RacesProps[]>(null)
  const [loading, setLoading] = useState(true)

  const init = async () => {
    setLoading(true)
    const dbRaces: Array<RacesProps> = await fetchPath('races')

    setRaces(dbRaces)
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
                <Typography variant="body1">
                  {index + 1}: {v.raceName}
                </Typography>
              </CardContent>
            </Card>
          </span>
        ))
      )}
    </>
  )
}

export default Races
