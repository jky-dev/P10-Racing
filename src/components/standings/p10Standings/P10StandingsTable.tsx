import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import React, { useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

import { useSupabaseContext } from '../../../contexts/SupabaseContext'
import { driverName } from '../../../helpers/helpers'

const P10StandingsTable = () => {
  const { p10PointsMap, driversMap } = useSupabaseContext()
  const { ref, inView, entry } = useInView()
  const sortedP10Array = useMemo(
    () => Array.from(p10PointsMap.entries()).sort((a, b) => b[1] - a[1]),
    [p10PointsMap]
  )

  React.useEffect(() => {
    inView &&
      Array.from(entry.target.children).forEach((child) =>
        child.classList.add('fadeInListDelay')
      )
  }, [inView])

  return (
    <Table size="small" className="fadeIn">
      <TableHead>
        <TableRow>
          <TableCell>Rank</TableCell>
          <TableCell align="right">Driver</TableCell>
          <TableCell align="right">Points</TableCell>
        </TableRow>
      </TableHead>
      <TableBody ref={ref}>
        {sortedP10Array.map(([driverId, points], index) => (
          <TableRow key={driverId} className="hidden">
            <TableCell>{index + 1}</TableCell>
            <TableCell className="driverConstructorContainer" align="right">
              <span className="driverName">
                {driverName(driversMap.get(driverId), false)}{' '}
              </span>
              <img
                src={`/images/${driversMap.get(driverId).constructor}.png`}
                height={20}
              />
            </TableCell>
            <TableCell align="right">{points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default P10StandingsTable
