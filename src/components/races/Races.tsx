import { Card, CardContent, Typography } from '@mui/material'
import { SupabaseClient } from '@supabase/supabase-js'
import React, { Key, useState } from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { RacesWithResultsDbProps } from '../../interfaces'
import Loader from '../loader/Loader'

const Races: React.FC = () => {
  const [races, setRaces] = useState<RacesWithResultsDbProps[] | null>(null)
  const [raceResults, setRaceResults] = useState([])
  const [loading, setLoading] = useState(true)
  const { client }: { client: SupabaseClient } = useSupabaseContext()

  const init = async () => {
    setLoading(true)
    const { data }: { data: RacesWithResultsDbProps[] } = await client
      .from('races')
      .select(`*, race_results ( * )`)

    const { data: drivers } = await client.from('drivers').select('*')
    setRaces(data)
    setRaceResults([])
    setLoading(false)
  }

  const formatDateTime = (race: RacesWithResultsDbProps) => {
    const test = new Date(`${race.date} ${race.time}`)
    return test.toLocaleString()
  }

  React.useEffect(() => {
    init()
  }, [])

  if (races === null) return null

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        races
          .sort((a, b) => a.round_number - b.round_number)
          .map((v) => (
            <span key={v.race_name as Key}>
              <Card variant="outlined" sx={{ width: '300px' }}>
                <CardContent>
                  <Typography variant="h6">{v.race_name}</Typography>
                  <Typography variant="body1">{formatDateTime(v)}</Typography>
                  <Typography variant="body1">Results</Typography>
                  {v.race_results
                    .sort((a, b) => a.position - b.position)
                    .map((result) => (
                      <Typography variant="body2" key={result.position}>
                        {result.position}: {result.driver_id}
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
