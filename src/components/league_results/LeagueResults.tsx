import React from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { LeagueResultsDbProps } from '../../interfaces'
import Loader from '../loader/Loader'

interface LeagueResultsProps {
  leagueId: string
}

const LeagueResults: React.FC<LeagueResultsProps> = ({ leagueId }) => {
  const [results, setResults] = React.useState<LeagueResultsDbProps[] | null>(
    null
  )
  const [loading, setLoading] = React.useState(false)
  const { client } = useSupabaseContext()

  const fetchResults = async () => {
    setLoading(true)
    const { data }: { data: LeagueResultsDbProps[] } = await client
      .from('league_results')
      .select(
        `
        driver_id,
        races (race_name, round_number, year, date, time),
        leagues (name, invite_code)`
      )
      .eq('league_id', leagueId)

    setResults(data)
    console.log(data)
    setLoading(false)
  }

  React.useEffect(() => {
    if (leagueId === null) return
    fetchResults()
  }, [leagueId])

  if (leagueId === null) return null

  if (loading) return <Loader />

  if (results === null) return null

  return (
    <div>
      Results
      <div>
        {results.length !== 23 && <div>Error</div>}
        {results
          .sort((a, b) => a.races.round_number - b.races.round_number)
          .map((result) => {
            return (
              <div key={result.races.race_name}>
                <h4>
                  {result.races.round_number}. {result.races.race_name}
                </h4>
                <h5>{result.driver_id}</h5>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default LeagueResults
