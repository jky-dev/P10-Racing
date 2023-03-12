import { Button, TextField } from '@mui/material'
import React from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { createLeague } from '../../services/database'
import Loader from '../loader/Loader'

const joinLeague = () => {
  // add user to the league
  // add league to the user
  alert('Coming soon!')
}

const Leagues: React.FC = () => {
  const [leagueName, setLeagueName] = React.useState('')
  const [leagueCode, setLeagueCode] = React.useState('')
  const { client, user } = useSupabaseContext()
  const [loading, setLoading] = React.useState(false)
  const [joinedLeagues, setJoinedLeagues] = React.useState([])

  const onCreateHandler = async () => {
    // add the league to your user profile
    // create league, access code and add user to it
    // create access code -> league mapping
    if (leagueName.length === 0) return
    setLoading(true)
    await createLeague(
      client,
      user,
      leagueName,
      crypto.randomUUID().slice(0, 6)
    )
    setLoading(false)
  }

  const fetchLeagues = async () => {
    setLoading(true)
    const { data } = await client.from('league_members').select(`
      league_id,
      leagues (
        name
      )
    `)

    console.log(data)
    setJoinedLeagues(data)
    setLoading(false)
  }

  React.useEffect(() => {
    fetchLeagues()
  }, [])

  if (loading) return <Loader />

  return (
    <>
      <div>My Leagues</div>
      {joinedLeagues.map((league) => {
        return <div key={league.leagues.name}>{league.leagues.name}</div>
      })}
      <div>
        <TextField
          helperText="Enter your league name"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
        >
          League name
        </TextField>
        <Button variant="contained" onClick={onCreateHandler}>
          Create a league
        </Button>
      </div>
      <div>
        <TextField
          helperText="Enter your league code here"
          value={leagueCode}
          onChange={(e) => setLeagueCode(e.target.value)}
        >
          League code
        </TextField>
        <Button variant="contained" onClick={joinLeague}>
          Join a league
        </Button>
      </div>
    </>
  )
}

export default Leagues
