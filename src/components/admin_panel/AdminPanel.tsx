import {
  Button,
  Divider,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import {
  setConstructors,
  setDrivers,
  setRaceResultsByRound,
  setRaces,
} from '../../services/f1'

const AdminPanel: React.FC = () => {
  const [round, setRound] = useState<number>(1)
  const { client } = useSupabaseContext()

  return (
    <List>
      <ListItem>
        <Typography variant="body1" mr={2}>
          Set Race Details
        </Typography>
        <Button onClick={() => setRaces(client)} variant="contained">
          Set Races
        </Button>
      </ListItem>
      <Divider />
      <ListItem>
        <TextField
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={round}
          onChange={(e) => setRound(Number(e.target.value))}
        />
        <Button
          onClick={() => setRaceResultsByRound(client, round)}
          variant="contained"
        >
          Set Results By Round
        </Button>
      </ListItem>
      <Divider />
      <ListItem>
        <Typography variant="body1" mr={2}>
          Set Constructors
        </Typography>
        <Button onClick={() => setConstructors(client)} variant="contained">
          Set Constructors
        </Button>
      </ListItem>
      <Divider />
      <ListItem>
        <Typography variant="body1" mr={2}>
          Set Drivers
        </Typography>
        <Button onClick={() => setDrivers(client)} variant="contained">
          Set Drivers
        </Button>
      </ListItem>
    </List>
  )
}

export default AdminPanel
