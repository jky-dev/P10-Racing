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

import { useSupabaseContext } from '../../../contexts/SupabaseContext'
import { timeLeftString } from '../../../helpers/helpers'
import useCountdown from '../../../hooks/useCountdown'
import {
  LeagueMembersDbProps,
  LeagueResultsDbProps,
  RacesDbProps,
} from '../../../interfaces'
import Picker from '../Picker/Picker'
import ResultsTable from '../Results/ResultsTable'
import styles from './RaceAccordion.module.scss'

interface RaceAccordionProps {
  race: RacesDbProps
  nextRaceRoundId: number
  leagueResultsMap: Map<string, Map<number, LeagueResultsDbProps>>
  submitDriver: (driverId: number, dnfDriverId: number, rowId: number) => void
  leagueMembers: Map<string, LeagueMembersDbProps>
}

const RaceAccordion = ({
  race,
  nextRaceRoundId,
  leagueResultsMap,
  submitDriver,
  leagueMembers,
}: RaceAccordionProps) => {
  const { user, driversMap } = useSupabaseContext()

  const passedQualiDate = (race: RacesDbProps) => {
    const raceDate = Date.parse(`${race.quali_date} ${race.quali_time}`)
    return raceDate < Date.now()
  }

  const { days, hours, minutes, seconds } = useCountdown(
    new Date(`${race.quali_date} ${race.quali_time}`)
  )

  return (
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
              leagueResultsMap.get(user.id).get(race.id)?.driver_id ===
                null && (
                <Tooltip title="Lock in a driver before the qualifying starts!">
                  <PriorityHigh color="error" />
                </Tooltip>
              )}
          </Typography>
          {!passedQualiDate(race) && (
            <Typography variant="body2">{`Picks end in ${timeLeftString(
              days,
              hours,
              minutes,
              seconds
            )}`}</Typography>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {!passedQualiDate(race) && (
          <div className={styles.racePicks}>
            <Picker
              id={race.race_name}
              rowId={leagueResultsMap.get(user.id).get(race.id)?.id}
              drivers={driversMap}
              submitHandler={submitDriver}
              resultsRow={leagueResultsMap.get(user.id).get(race.id)}
            />
          </div>
        )}
        <ResultsTable
          leagueMembers={leagueMembers}
          leagueResultsMap={leagueResultsMap}
          race={race}
        />
      </AccordionDetails>
    </Accordion>
  )
}

export default RaceAccordion
