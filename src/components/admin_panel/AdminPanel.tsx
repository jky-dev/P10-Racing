import {
  Button,
  Divider,
  Input,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { setRaceResultsByRound, setRaces } from '../../services/f1'

const AdminPanel: React.FC = () => {
  const [round, setRound] = useState<number>(1)

  return (
    <List>
      <ListItem>
        <Typography variant="body1" mr={2}>
          Set Race Details
        </Typography>
        <Button onClick={() => setRaces()} variant="contained">
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
          onClick={() => setRaceResultsByRound(round)}
          variant="contained"
        >
          Set Results By Round
        </Button>
      </ListItem>
    </List>
  )
}

export default AdminPanel
