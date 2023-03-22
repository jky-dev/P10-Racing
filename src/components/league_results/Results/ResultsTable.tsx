import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material'
import React from 'react'

import { useSupabaseContext } from '../../../contexts/SupabaseContext'
import { driverName } from '../../../helpers/helpers'
import {
  LeagueMembersDbProps,
  LeagueResultsDbProps,
  RacesDbProps,
} from '../../../interfaces'
import styles from './ResultsTable.module.scss'

interface ResultsTable {
  leagueMembers: Map<string, LeagueMembersDbProps>
  leagueResultsMap: Map<string, Map<number, LeagueResultsDbProps>>
  race: RacesDbProps
}
const ResultsTable: React.FC<ResultsTable> = ({
  leagueMembers,
  leagueResultsMap,
  race,
}) => {
  const { raceResultsDriverMap, driversMap } = useSupabaseContext()
  const isMobile = useMediaQuery('(max-width:600px)')

  const getPointsColumn = (userId: string, raceId: number) => {
    const points = leagueResultsMap.get(userId).get(raceId).points_gained

    if (points === null) return '-'

    const pos = raceResultsDriverMap
      .get(raceId)
      .get(leagueResultsMap.get(userId).get(raceId).driver_id).position

    return `${points} (${pos})`
  }

  return (
    <Table sx={{ width: '100%', overflow: 'auto' }}>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{
              width: '30%',
            }}
          >
            User
          </TableCell>
          <TableCell
            align="right"
            sx={{
              width: '40%',
            }}
          >
            Pick
          </TableCell>
          <TableCell
            align="right"
            sx={{
              width: '30%',
            }}
          >
            {isMobile ? 'Points' : 'Points (Pos)'}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from(leagueMembers.entries()).map(([uuid, value]) => (
          <TableRow key={uuid}>
            <TableCell
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: 0,
              }}
            >
              {value.users.name}
            </TableCell>
            <TableCell
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: 0,
                verticalAlign: 'middle',
              }}
              align="right"
            >
              <div className={styles.driverName}>
                <span className={styles.text}>
                  {driverName(
                    driversMap.get(
                      leagueResultsMap.get(uuid).get(race.id).driver_id
                    ),
                    isMobile,
                    '-'
                  )}
                </span>
                {!!driversMap.get(
                  leagueResultsMap.get(uuid).get(race.id).driver_id
                ) && (
                  <img
                    src={`/images/${
                      driversMap.get(
                        leagueResultsMap.get(uuid).get(race.id).driver_id
                      ).constructor
                    }.png`}
                    height={20}
                  />
                )}
              </div>
            </TableCell>
            <TableCell
              align="right"
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: 0,
              }}
            >
              {getPointsColumn(uuid, race.id)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ResultsTable
