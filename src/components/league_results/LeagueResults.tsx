import { PriorityHigh } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import styles from './LeagueResults.module.scss'
import Picker from './Picker/Picker'

interface LeagueResultsProps {
  leagueId: number
}

const LeagueResults: React.FC<LeagueResultsProps> = ({ leagueId }) => {
  const [loading, setLoading] = React.useState(true)
  const {
    client,
    user,
    driversMap,
    races,
    raceResultsDriverMap,
    driversIdMap,
  } = useSupabaseContext()
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

  const getPoints = (userId: string, raceId: number) => {
    const points = leagueResultsMap.get(userId).get(raceId).points_gained

    if (points === null) return '-'

    return points
  }

  React.useEffect(() => {
    if (leagueId === -1) return
    fetchResults()
  }, [leagueId])

  if (leagueId === -1) return null

  if (loading) return <Loader />

  return (
    <div className={styles.container}>
      <Typography variant="h4">Next Race Picks</Typography>
      <div>
        {Array.from(leagueMembers.entries()).map(([key, value]) => (
          <Typography key={key}>
            {`${value.users.name} - ${driverName(
              driversMap.get(
                leagueResultsMap.get(key).get(nextRaceRoundId).driver_id
              ),
              'Not picked'
            )}`}
          </Typography>
        ))}
      </div>
      <Typography variant="h4">Races</Typography>
      <div>
        {leagueResultsMap.get(user.id).size !== 23 && (
          <div>Error - missing some results</div>
        )}
        {races
          .sort((a, b) => a.round_number - b.round_number)
          .map((race) => (
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
                <Typography>
                  {race.race_name} - {formatRaceDateTime(race.date, race.time)}
                </Typography>
                {nextRaceRoundId === race.id &&
                  leagueResultsMap.get(user.id).get(race.id)?.driver_id ===
                    null && (
                    <Tooltip title="Lock in a driver before the race starts!">
                      <PriorityHigh color="error" />
                    </Tooltip>
                  )}
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles.racePicks}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell align="right">Pick</TableCell>
                        <TableCell align="right">Finish</TableCell>
                        <TableCell align="right">Points</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.from(leagueMembers.entries()).map(
                        ([uuid, value]) => (
                          <TableRow>
                            <TableCell>{value.users.name}</TableCell>
                            <TableCell align="right">
                              {driverName(
                                driversMap.get(
                                  leagueResultsMap.get(uuid).get(race.id)
                                    .driver_id
                                ),
                                '-'
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {raceResultsDriverMap
                                .get(race.id)
                                .get(
                                  leagueResultsMap.get(uuid).get(race.id)
                                    .driver_id
                                )?.position || '-'}
                            </TableCell>
                            <TableCell align="right">
                              {getPoints(uuid, race.id)}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
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
    </div>
  )
}

export default LeagueResults
