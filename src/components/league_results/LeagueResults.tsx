import { PriorityHigh } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Tooltip,
  Typography,
} from '@mui/material'
import React from 'react'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import { driverName, formatRaceDateTime } from '../../helpers/helpers'
import {
  LeagueMembersDbProps,
  LeagueResultsDbProps,
  RacesDbProps,
} from '../../interfaces'
import Loader from '../loader/Loader'
import Leaderboard from './Leaderboard/Leaderboard'
import styles from './LeagueResults.module.scss'
import Picker from './Picker/Picker'
import ResultsTable from './Results/ResultsTable'

interface LeagueResultsProps {
  leagueId: number
  name: string
  owner: boolean
  onDelete: () => void
}

const LeagueResults: React.FC<LeagueResultsProps> = ({
  leagueId,
  name,
  owner,
  onDelete,
}) => {
  const [loading, setLoading] = React.useState(true)
  const { client, user, driversMap, races } = useSupabaseContext()
  const [leagueMembers, setLeagueMembers] = React.useState(
    new Map<string, LeagueMembersDbProps>()
  )
  const [nextRaceRoundId, setNextRaceRoundId] = React.useState(-1)
  const [leagueResultsMap, setLeagueResultsMap] = React.useState(
    new Map<string, Map<number, LeagueResultsDbProps>>()
  )

  const { sendAlert } = useUtilsContext()

  const fetchResults = async () => {
    setLoading(true)
    const { data }: { data: unknown } = await client
      .from('league_results')
      .select(
        `
          *,
          leagues (name, invite_code)
        `
      )
      .eq('league_id', leagueId)

    const { data: leagueMembers }: { data: unknown } = await client
      .from('league_members')
      .select(
        `*,
          users (*)
        `
      )
      .eq('league_id', leagueId)

    const map = new Map<string, Map<number, LeagueResultsDbProps>>()
    const tempMembersMap = new Map<string, LeagueMembersDbProps>()

    for (const member of leagueMembers as LeagueMembersDbProps[]) {
      map.set(member.user_uuid, new Map<number, LeagueResultsDbProps>())
      tempMembersMap.set(member.user_uuid, member)
    }

    for (const leagueResult of data as LeagueResultsDbProps[]) {
      const userId = leagueResult.user_uuid
      map.get(userId).set(leagueResult.race_id, leagueResult)
    }

    setLeagueResultsMap(map)
    setLeagueMembers(tempMembersMap)

    const indexOfNextRace = races.findIndex((value) => !disabled(value))

    setNextRaceRoundId(races[indexOfNextRace].id)

    setLoading(false)
  }

  const disabled = (race: RacesDbProps) => {
    const raceDate = Date.parse(`${race.date} ${race.time}`)
    return raceDate < Date.now()
  }

  const deleteLeague = async () => {
    await client.rpc('delete_league', { league_id: leagueId })
  }

  const submitDriver = async (driverId: number, rowId: number) => {
    const { error } = await client
      .from('league_results')
      .update({
        driver_id: driverId,
      })
      .eq('id', rowId)

    if (!error) {
      sendAlert('Submitted driver: ' + driverName(driversMap.get(driverId)))
      fetchResults()
    } else {
      sendAlert('Failed to submit driver - please try again later', 'error')
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete league '${name}'? This action CANNOT be undone.`
      )
    )
      return

    await deleteLeague()

    onDelete()

    console.log('commence delete')
  }

  React.useEffect(() => {
    if (leagueId === -1) return
    fetchResults()
  }, [leagueId])

  if (leagueId === -1) return null

  if (loading) return <Loader />

  return (
    <div className={styles.container}>
      <Leaderboard
        leagueResultsMap={leagueResultsMap}
        usersMap={leagueMembers}
      />
      <Typography variant="h4">Races</Typography>
      <div>
        {leagueResultsMap.get(user.id).size !== 23 && (
          <div>Error - missing some results</div>
        )}
        {races.map((race) => (
          <Accordion
            key={race.race_name}
            defaultExpanded={nextRaceRoundId === race.id}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  justifyContent: 'space-between',
                },
              }}
            >
              <div className={styles.accordionText}>
                <Typography className={styles.raceName}>
                  {race.race_name}{' '}
                  {nextRaceRoundId === race.id &&
                    leagueResultsMap.get(user.id).get(race.id)?.driver_id ===
                      null && (
                      <Tooltip title="Lock in a driver before the race starts!">
                        <PriorityHigh color="error" />
                      </Tooltip>
                    )}
                </Typography>
                <Typography variant="body2">
                  {formatRaceDateTime(race.date, race.time)}
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className={styles.racePicks}>
                <ResultsTable
                  leagueMembers={leagueMembers}
                  leagueResultsMap={leagueResultsMap}
                  race={race}
                />
              </div>
              <Picker
                id={race.race_name}
                rowId={leagueResultsMap.get(user.id).get(race.id)?.id}
                drivers={driversMap}
                submitHandler={submitDriver}
                preSelectedDriver={
                  leagueResultsMap.get(user.id).get(race.id)?.driver_id
                }
                disabled={disabled(race)}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      {owner && (
        <span>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete League
          </Button>
        </span>
      )}
    </div>
  )
}

export default LeagueResults
