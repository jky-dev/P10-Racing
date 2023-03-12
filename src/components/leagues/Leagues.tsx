import { Button, TextField } from '@mui/material'
import React from 'react'

const joinLeague = () => {
  // add user to the league
  // add league to the user
  alert('Coming soon!')
}

const createLeague = (user: any, name: string) => {
  // add the league to your user profile
  // create league, access code and add user to it
  // create access code -> league mapping
  if (name.length === 0) return
}

const Leagues: React.FC = () => {
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
          onClick={() => createLeague(null, leagueName)}
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
