import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material'
import React from 'react'
import { useInView } from 'react-intersection-observer'

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
  const { ref, inView, entry } = useInView()

  const getPointsColumn = (userId: string, raceId: number) => {
    const points = leagueResultsMap.get(userId).get(raceId)?.points_gained

    if (points === null) return '-'

    const pos =
      raceResultsDriverMap
        .get(raceId)
        .get(leagueResultsMap.get(userId).get(raceId).driver_id)?.position ??
      null

    return `${points} ${pos != null ? `(${pos})` : ''}`
  }

  const getDnfPointsColumn = (userId: string, raceId: number) => {
    const points = leagueResultsMap.get(userId).get(raceId).dnf_points_gained

    if (points === null) return '-'

    return `${points}`
  }

  React.useEffect(() => {
    inView &&
      Array.from(entry.target.children).forEach((e) =>
        e.classList.add('fadeInListDelay')
      )
  }, [inView])

  return (
    <Table sx={{ width: '100%', overflow: 'auto' }} size="small">
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
            {isMobile ? 'Picks' : 'Picks (P10/DNF)'}
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
      <TableBody ref={ref}>
        {Array.from(leagueMembers.entries()).map(([uuid, value]) => (
          <React.Fragment key={uuid}>
            <TableRow>
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
            <TableRow key={uuid + 'dnf'}>
              <TableCell></TableCell>
              <TableCell align="right">
                <div className={styles.driverName}>
                  <span className={styles.text}>
                    {leagueResultsMap.get(uuid).get(race.id).dnf_driver_id ===
                    241
                      ? 'NO DNF!'
                      : driverName(
                          driversMap.get(
                            leagueResultsMap.get(uuid).get(race.id)
                              .dnf_driver_id
                          ),
                          isMobile,
                          '-'
                        )}
                  </span>
                  {!!driversMap.get(
                    leagueResultsMap.get(uuid).get(race.id).dnf_driver_id
                  ) && (
                    <img
                      src={`/images/${
                        driversMap.get(
                          leagueResultsMap.get(uuid).get(race.id).dnf_driver_id
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
                {getDnfPointsColumn(uuid, race.id)}
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  )
}

export default ResultsTable
