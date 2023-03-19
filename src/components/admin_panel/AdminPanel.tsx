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
  LeagueMembersDbProps,
  LeaguesProps,
  UserDbProps,
} from '../../interfaces'
import { getTable } from '../../services/database'
import {
  setConstructors,
  setDrivers,
  setRaceResultsByRound,
  setRaces,
} from '../../services/f1'
import Loader from '../loader/Loader'

const AdminPanel: React.FC = () => {
  const [round, setRound] = useState<number>(1)
  const { client } = useSupabaseContext()

  const [leaguesMap, setLeaguesMap] =
    React.useState<Map<number, LeaguesProps>>(null)
  const [leagueMembersMap, setLeagueMembersMap] =
    React.useState<Map<number, LeagueMembersDbProps[]>>(null)
  const [userMap, setUserMap] = React.useState<Map<string, UserDbProps>>(null)

  const [loading, setLoading] = React.useState(true)

  const func = async () => {
    const { data: leagues }: any = await getTable(client, 'leagues')

    const tLM = new Map<number, LeaguesProps>()
    const tLMM = new Map<number, LeagueMembersDbProps[]>()
    for (const league of leagues as LeaguesProps[]) {
      tLM.set(league.id, league)
      tLMM.set(league.id, [])
    }

    const { data: league_members }: any = await getTable(
      client,
      'league_members'
    )
    for (const member of league_members as LeagueMembersDbProps[]) {
      tLMM.get(member.league_id).push(member)
    }

    const { data: users }: any = await getTable(client, 'users')
    const tUM = new Map<string, UserDbProps>()
    for (const user of users as UserDbProps[]) {
      tUM.set(user.uuid, user)
    }

    setLeaguesMap(tLM)
    setLeagueMembersMap(tLMM)
    setUserMap(tUM)

    setLoading(false)
  }

  React.useEffect(() => {
    func()
  }, [])

  if (loading) return <Loader />

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
      <Divider />
      {Array.from(leaguesMap.entries()).map(([leagueId, league]) => (
        <>
          <ListItem sx={{ flexDirection: 'column' }}>
            <Typography variant="h4">{league.name}</Typography>
            {leagueMembersMap.get(leagueId).map((member) => (
              <div>
                <Typography variant="body1">
                  {userMap.get(member.user_uuid).name}
                </Typography>
              </div>
            ))}
          </ListItem>
          <Divider />
        </>
      ))}
    </List>
  )
}

export default AdminPanel
