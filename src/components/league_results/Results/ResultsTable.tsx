import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import React from 'react'
import { useSupabaseContext } from '../../../contexts/SupabaseContext'
import { driverName } from '../../../helpers/helpers'
import {
  LeagueMembersDbProps,
  LeagueResultsDbProps,
  RacesDbProps,
} from '../../../interfaces'

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
  const getPointsColumn = (userId: string, raceId: number) => {
    const points = leagueResultsMap.get(userId).get(raceId).points_gained

    if (points === null) return '-'

    const pos = raceResultsDriverMap
      .get(raceId)
      .get(leagueResultsMap.get(userId).get(raceId).driver_id).position

    return `${points} (${pos})`
  }

  return (
    <Table sx={{ width: '100%' }}>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{
              maxWidth: '10px',
            }}
          >
            User
          </TableCell>
          <TableCell
            align="right"
            sx={{
              maxWidth: '10px',
            }}
          >
            Pick
          </TableCell>
          <TableCell
            align="right"
            sx={{
              maxWidth: '10px',
            }}
          >
            Points (Pos)
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from(leagueMembers.entries()).map(([uuid, value]) => (
          <TableRow>
            <TableCell
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: '10px',
              }}
            >
              {value.users.name}
            </TableCell>
            <TableCell
              align="right"
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: '10px',
              }}
            >
              {driverName(
                driversMap.get(
                  leagueResultsMap.get(uuid).get(race.id).driver_id
                ),
                '-'
              )}
            </TableCell>
            <TableCell
              align="right"
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: '10px',
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
