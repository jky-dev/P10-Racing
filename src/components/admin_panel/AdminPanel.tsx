import {
  Button,
  Divider,
  List,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import React, { useRef, useState } from 'react'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import { pointsMap } from '../../helpers/helpers'
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
import styles from './AdminPanel.module.scss'

const AdminPanel: React.FC = () => {
  const [round, setRound] = useState<number>(1)
  const { client, driversIdMap, races } = useSupabaseContext()
  const [leaguesMap, setLeaguesMap] =
    React.useState<Map<number, LeaguesProps>>(null)
  const [leagueMembersMap, setLeagueMembersMap] =
    React.useState<Map<number, LeagueMembersDbProps[]>>(null)
  const [userMap, setUserMap] = React.useState<Map<string, UserDbProps>>(null)
  const [loading, setLoading] = React.useState(true)
  const { sendAlert } = useUtilsContext()

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

    let updatedCount = 0
    for (const result of leagueResults as LeagueResultsDbProps[]) {
      const position = driverResultMap.get(result?.driver_id)?.position
      if (!position) continue
      const pointsGained = pointsMap[position] ?? 0
      const dnfPointsGained = calcDnfPoints(result?.dnf_driver_id, dnfDriverId)

      await client
        .from('league_results')
        .update({
          points_gained: pointsGained,
          dnf_points_gained: dnfPointsGained,
        })
        .eq('id', result.id)
      updatedCount++
    }
    sendAlert(`Calculated results for ${updatedCount} players`)
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

  const setRaceResultsByRoundClickHandler = async () => {
    try {
      await setRaceResultsByRound(client, round, driversIdMap)
      sendAlert('success')
    } catch (e) {
      sendAlert(e.message, 'error')
    }
  }

  const setQualiByRoundClickHandler = async () => {
    try {
      await setQualiResultsByRound(client, round, driversIdMap)
      sendAlert('success')
    } catch (e) {
      sendAlert(e.message, 'error')
    }
  }

  const calcRaceRoundForApi = (index: number) => {
    // round 6 was cancelled, and therefore index 6 should be round 6
    if (index > 5) return index

    return index + 1
  }

  React.useEffect(() => {
    setupLeagues()
  }, [])

  if (loading) return <Loader />

  return (
    <List>
      <Typography variant="body1" mr={2}>
        Setup
      </Typography>
      <div className={styles.buttonContainer}>
        <Button onClick={() => setRaces(client)} variant="contained">
          Set Races
        </Button>
        <Button onClick={() => setConstructors(client)} variant="contained">
          Set Constructors
        </Button>
        <Button onClick={() => setDrivers(client)} variant="contained">
          Set Drivers
        </Button>
      </div>
      <Divider />
      <div>
        <Select
          value={round}
          onChange={(e) => setRound(Number(e.target.value))}
        >
          {Array.from(races.values()).map((key, index) => (
            <MenuItem value={calcRaceRoundForApi(index)} key={key.id}>
              <span>{key.race_name}</span>
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={setQualiByRoundClickHandler} variant="contained">
          Quali
        </Button>
        <Button onClick={setRaceResultsByRoundClickHandler} variant="contained">
          Race Results
        </Button>
        <Button onClick={() => calculatePoints()} variant="contained">
          Calculate Points
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
