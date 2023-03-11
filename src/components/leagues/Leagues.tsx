import { Button, TextField } from '@mui/material'
import React from 'react'
import { dbCreateLeague } from '../../services/database'

const joinLeague = () => {
  // add user to the league
  // add league to the user
  alert('Coming soon!')
}

const createLeague = () => {
  // add the league to your user profile
  // create league, access code and add user to it
  // create access code -> league mapping
  alert('Coming soon!')
  dbCreateLeague()
}

const Leagues: React.FC = () => {
  return (
    <>
      <div>My Leagues</div>
      <div>
        <Button variant="contained" onClick={createLeague}>
          Create a league
        </Button>
      </div>
      <div>
        <TextField helperText="Enter your league code here">
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
