import { TextField } from '@mui/material'
import React from 'react'

const joinLeague = () => {
  // add user to the league
  // add league to the user
}

const createLeague = () => {
  // add the league to your user profile
  // create league, access code and add user to it
  // create access code -> league mapping
}

const Leagues: React.FC = () => {
  return (
    <>
      <div>My Leagues</div>
      <button>Create a league</button>
      <TextField>League code</TextField>
      <button>Join a league</button>
    </>
  )
}

export default Leagues
