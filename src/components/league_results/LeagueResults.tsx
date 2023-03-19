import { PriorityHigh } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
  Typography,
} from '@mui/material'
import React from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import { driverName, formatRaceDateTime } from '../../helpers/helpers'
import { LeagueResultsDbProps, RacesDbProps } from '../../interfaces'
import Loader from '../loader/Loader'
import styles from './LeagueResults.module.scss'
import Picker from './Picker/Picker'

interface LeagueResultsProps {
  leagueId: number
}

const LeagueResults: React.FC<LeagueResultsProps> = ({ leagueId }) => {
  const [results, setResults] = React.useState<LeagueResultsDbProps[] | null>(
    null
  )
  const [loading, setLoading] = React.useState(false)
  const { client, user, driversMap } = useSupabaseContext()
  const [leagueMembers, setLeagueMembers] = React.useState<string[]>([])
  const [nextRaceRound, setNextRaceRound] = React.useState(-1)
  const { sendAlert } = useUtilsContext()

  const fetchResults = async () => {
    setLoading(true)
    const { data }: { data: LeagueResultsDbProps[] } = await client
      .from('league_results')
      .select(
        `
          *,
          races (race_name, round_number, year, date, time),
          leagues (name, invite_code)
        `
      )
      .eq('league_id', leagueId)

    const personalResults = data
      .filter((value) => value.user_uuid === user.id)
      .sort((a, b) => a.races.round_number - b.races.round_number)

    setNextRaceRound(
      personalResults.findIndex((value) => !disabled(value.races))
    )

    const { data: leagueMembers }: { data: LeagueResultsDbProps[] } =
      await client
        .from('league_members')
        .select(
          `*,
            users (*)
          `
        )
        .eq('league_id', leagueId)

    setLeagueMembers(leagueMembers.map((member) => member.users.name))

    setResults(personalResults)
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
    } else {
      sendAlert('Failed to submit driver - please try again later', 'error')
    }
  }

  React.useEffect(() => {
    if (leagueId === null) return
    fetchResults()
  }, [leagueId])

  if (leagueId === null || results === null) return null

  if (loading) return <Loader />

  return (
    <div className={styles.container}>
      <Typography variant="h4">Members</Typography>
      <div>
        {leagueMembers.map((member) => (
          <Typography key={member}>{member}</Typography>
        ))}
      </div>
      <Typography variant="h4">Results</Typography>
      <div>
        {results.length !== 23 && <div>Error - missing some results</div>}
        {results.map((result, index) => (
          <Accordion
            key={result.races.race_name}
            defaultExpanded={nextRaceRound === index}
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
                {result.races.race_name} -{' '}
                {formatRaceDateTime(result.races.date, result.races.time)}
              </Typography>
              {index === nextRaceRound && result.driver_id === null && (
                <Tooltip title="Lock in a driver before the race starts!">
                  <PriorityHigh color="error" />
                </Tooltip>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Picker
                id={result.races.race_name}
                rowId={result.id}
                drivers={driversMap}
                submitHandler={submitDriver}
                preSelectedDriver={result.driver_id}
                disabled={disabled(result.races)}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  )
}

export default LeagueResults
