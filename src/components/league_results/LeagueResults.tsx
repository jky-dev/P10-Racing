import { PriorityHigh } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import React from 'react'
import { InView } from 'react-intersection-observer'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import { formatRaceDateTime } from '../../helpers/helpers'
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
}

const LeagueResults: React.FC<LeagueResultsProps> = ({ leagueId }) => {
  const [loading, setLoading] = React.useState(true)
  const { client, user, driversMap, races } = useSupabaseContext()
  const [leagueMembers, setLeagueMembers] = React.useState(
    new Map<string, LeagueMembersDbProps>()
  )
  const [nextRaceRoundId, setNextRaceRoundId] = React.useState(-1)
  const [leagueResultsMap, setLeagueResultsMap] = React.useState(
    new Map<string, Map<number, LeagueResultsDbProps>>()
  )
  const [indexOfNextRace, setIndexOfNextRace] = React.useState(-1)

  const { sendAlert } = useUtilsContext()
  const isMobile = useMediaQuery('(max-width:600px)')

  const fetchResults = async () => {
    setLoading(true)
    const { data }: { data: unknown } = await client
      .from('league_results')
      .select(
        `
          *,
          leagues (name, invite_code),
          races (*)
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
      if (leagueResult.year === 2023) continue
      const userId = leagueResult.user_uuid
      map.get(userId).set(leagueResult.race_id, leagueResult)
    }

    setLeagueResultsMap(map)
    setLeagueMembers(tempMembersMap)

    const nextRaceIndex = races.findIndex((value) => !passedQualiDate(value))

    setIndexOfNextRace(nextRaceIndex)
    setNextRaceRoundId(nextRaceIndex !== -1 ? races[nextRaceIndex].id : -1)
    setLoading(false)
  }

  const passedQualiDate = (race: RacesDbProps) => {
    const raceDate = Date.parse(`${race.quali_date} ${race.quali_time}`)
    return raceDate < Date.now()
  }

  const submitDriver = async (
    driverId: number,
    dnfDriverId: number,
    rowId: number
  ) => {
    const { error } = await client
      .from('league_results')
      .update({
        driver_id: driverId,
        dnf_driver_id: dnfDriverId,
      })
      .eq('id', rowId)

    if (!error) {
      sendAlert('Submitted!')
      fetchResults()
    } else {
      sendAlert('Failed to submit drivers - please try again later', 'error')
    }
  }

  React.useEffect(() => {
    if (leagueId === -1) return
    fetchResults()
  }, [leagueId])

  if (leagueId === -1) return null

  if (loading)
    return (
      <div className={`fadeIn ${styles.loaderContainer}`}>
        <Loader />
      </div>
    )

  const onChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      entry.target.classList.add('fadeInTop')
    }
  }

  return (
    <div className={styles.container}>
      <Leaderboard
        leagueResultsMap={leagueResultsMap}
        usersMap={leagueMembers}
      />
      {indexOfNextRace !== -1 && (
        <div className="fadeIn">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Upcoming Races
          </Typography>
          {races.slice(indexOfNextRace, undefined).map((race) => (
            <InView onChange={onChange} key={race.race_name} className="hidden">
              <Accordion
                key={race.race_name}
                defaultExpanded={nextRaceRoundId === race.id}
                elevation={2}
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
                        leagueResultsMap.get(user.id).get(race.id)
                          ?.driver_id === null && (
                          <Tooltip title="Lock in a driver before the qualifying starts!">
                            <PriorityHigh color="error" />
                          </Tooltip>
                        )}
                    </Typography>
                    <Typography variant="body2">
                      {formatRaceDateTime(race.date, race.time, isMobile)}
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
                  {!passedQualiDate(race) && (
                    <Picker
                      id={race.race_name}
                      rowId={leagueResultsMap.get(user.id).get(race.id)?.id}
                      drivers={driversMap}
                      submitHandler={submitDriver}
                      resultsRow={leagueResultsMap.get(user.id).get(race.id)}
                    />
                  )}
                </AccordionDetails>
              </Accordion>
            </InView>
          ))}
        </div>
      )}
      <div className="fadeIn">
        <Typography variant="h4" sx={{ mb: 2 }}>
          Past Races
        </Typography>
        {races
          .slice(0, indexOfNextRace)
          .reverse()
          .map((race) => (
            <InView onChange={onChange} key={race.race_name} className="hidden">
              <Accordion
                key={race.race_name}
                defaultExpanded={nextRaceRoundId === race.id}
                elevation={2}
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
                      {race.race_name}
                    </Typography>
                    <Typography variant="body2">
                      {formatRaceDateTime(race.date, race.time, isMobile)}
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
                </AccordionDetails>
              </Accordion>
            </InView>
          ))}
      </div>
    </div>
  )
}

export default LeagueResults
