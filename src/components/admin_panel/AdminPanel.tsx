import { Button, Divider, List, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import {
  LeagueMembersDbProps,
  LeagueResultsDbProps,
  LeaguesProps,
  RaceResultsDbProps,
  UserDbProps,
} from '../../interfaces'
import {
  getRaceByRoundNumber,
  getRaceResultsByRound,
  getTable,
} from '../../services/database'
import {
  setConstructors,
  setDrivers,
  setQualiResultsByRound,
  setRaceResultsByRound,
  setRaces,
} from '../../services/f1'
import Loader from '../loader/Loader'

const AdminPanel: React.FC = () => {
  const [round, setRound] = useState<number>(1)
  const { client, driversIdMap, user } = useSupabaseContext()
  const { pointsMap } = useUtilsContext()

  const [leaguesMap, setLeaguesMap] =
    React.useState<Map<number, LeaguesProps>>(null)
  const [leagueMembersMap, setLeagueMembersMap] =
    React.useState<Map<number, LeagueMembersDbProps[]>>(null)
  const [userMap, setUserMap] = React.useState<Map<string, UserDbProps>>(null)

  const [loading, setLoading] = React.useState(true)

  const setupLeagues = async () => {
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

  const calculatePoints = async () => {
    const { data: race } = await getRaceByRoundNumber(client, round)

    const raceId: number = race[0].id

    const { data } = await getRaceResultsByRound(client, round)

    const driverResultMap = new Map<number, RaceResultsDbProps>()
    let dnfDriverId = 241
    for (const result of data as RaceResultsDbProps[]) {
      driverResultMap.set(result.driver_id, result)
      if (result.position === 20 && isDnf(result.status)) {
        dnfDriverId = result.driver_id
      }
    }

    const { data: leagueResults } = await client
      .from('league_results')
      .select('*')
      .eq('race_id', raceId)

    for (const result of leagueResults as LeagueResultsDbProps[]) {
      const position = driverResultMap.get(result?.driver_id)?.position
      const pointsGained = pointsMap.get(position) ?? 0
      const dnfPointsGained = calcDnfPoints(result?.dnf_driver_id, dnfDriverId)

      await client
        .from('league_results')
        .update({
          points_gained: pointsGained,
          dnf_points_gained: dnfPointsGained,
        })
        .eq('id', result.id)
    }
  }

  const isDnf = (status: string) => {
    const lowered = status.toLowerCase()
    return !(lowered.includes('lap') || lowered.includes('finish'))
  }

  const calcDnfPoints = (driverId: number | null, dnfDriverId: number) => {
    if (null) return 0
    if (driverId != dnfDriverId) return 0
    if (driverId === 241) return 25
    return 10
  }

  React.useEffect(() => {
    setupLeagues()
  }, [])

  if (loading) return <Loader />

  return (
    <List>
      <div>
        <Typography variant="body1" mr={2}>
          Set Race Details
        </Typography>
        <Button onClick={() => setRaces(client)} variant="contained">
          Set Races
        </Button>
      </div>
      <Divider />
      <div>
        <div>
          <TextField
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={round}
            onChange={(e) => setRound(Number(e.target.value))}
            sx={{ width: 100 }}
          />
        </div>
        <span>
          <Button
            onClick={() => setRaceResultsByRound(client, round, driversIdMap)}
            variant="contained"
          >
            Race Results
          </Button>
        </span>
        <span>
          <Button onClick={() => calculatePoints()} variant="contained">
            Calculate Points
          </Button>
        </span>
        <span>
          <Button
            onClick={() => setQualiResultsByRound(client, round, driversIdMap)}
            variant="contained"
          >
            Quali
          </Button>
        </span>
      </div>
      <Divider />
      <div>
        <Typography variant="body1" mr={2}>
          Set Constructors
        </Typography>
        <Button onClick={() => setConstructors(client)} variant="contained">
          Set Constructors
        </Button>
      </div>
      <Divider />
      <div>
        <Typography variant="body1" mr={2}>
          Set Drivers
        </Typography>
        <Button onClick={() => setDrivers(client)} variant="contained">
          Set Drivers
        </Button>
      </div>
      <Divider />
      {Array.from(leaguesMap.entries()).map(([leagueId, league]) => (
        <React.Fragment key={leagueId}>
          <div>
            <Typography variant="h4">{league.name}</Typography>
            {leagueMembersMap.get(leagueId).map((member) => (
              <div key={member.user_uuid + leagueId}>
                <Typography variant="body1">
                  {userMap.get(member.user_uuid).name}
                </Typography>
              </div>
            ))}
          </div>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  )
}

export default AdminPanel
