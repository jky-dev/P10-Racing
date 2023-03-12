import { Button, TextField } from '@mui/material'
import { getAuth, User } from 'firebase/auth'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { dbCreateLeague } from '../../services/database'

const joinLeague = () => {
  // add user to the league
  // add league to the user
  alert('Coming soon!')
}

const createLeague = (user: User, name: string) => {
  // add the league to your user profile
  // create league, access code and add user to it
  // create access code -> league mapping
  if (name.length === 0) return
  dbCreateLeague(user, name)
}

const Leagues: React.FC = () => {
  const [user] = useAuthState(getAuth())
  const [leagueName, setLeagueName] = React.useState('')
  const [leagueCode, setLeagueCode] = React.useState('')

  return (
    <>
      <div>My Leagues</div>
      <div>
        <TextField
          helperText="Enter your league name"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
        >
          League name
        </TextField>
        <Button
          variant="contained"
          onClick={() => createLeague(user, leagueName)}
        >
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
