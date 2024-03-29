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
import { useUtilsContext } from '../../../contexts/UtilsContext'
import { driverName, pointsMap } from '../../../helpers/helpers'
import { RaceResultsDbProps } from '../../../interfaces'
import styles from './RaceResultsTable.module.scss'

interface RaceResultsTable {
  raceResults: RaceResultsDbProps[]
}

const RaceResultsTable: React.FC<RaceResultsTable> = ({ raceResults }) => {
  const { driversMap } = useSupabaseContext()
  const isMobile = useMediaQuery('(max-width:600px)')

  const { ref, inView, entry } = useInView()

  React.useEffect(() => {
    inView &&
      Array.from(entry.target.children).forEach((child) =>
        child.classList.add(`fadeInListDelay`)
      )
  }, [inView])

  return (
    <Table sx={{ width: '100%', overflow: 'auto' }} size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: '10%' }}>Position</TableCell>
          <TableCell align="right" sx={{ width: '50%' }}>
            Driver
          </TableCell>
          {!isMobile && (
            <>
              <TableCell align="right" sx={{ width: '20%' }}>
                F1 Points
              </TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>
                P10 Points
              </TableCell>
            </>
          )}
        </TableRow>
      </TableHead>
      <TableBody ref={ref}>
        {raceResults.map((result) => (
          <TableRow key={result.driver_id}>
            <TableCell>{result.position}</TableCell>
            <TableCell
              sx={{
                maxWidth: 0,
                verticalAlign: 'middle',
                borderBottom: 'none',
              }}
              align="right"
            >
              <div className={styles.driverName}>
                <span className={styles.text}>
                  {driverName(
                    driversMap.get(result.driver_id),
                    isMobile,
                    '-',
                    true
                  )}
                </span>
                <img
                  src={`/images/${
                    driversMap.get(result.driver_id).constructor
                  }.png`}
                  height={20}
                />
              </div>
            </TableCell>
            {!isMobile && (
              <>
                <TableCell
                  align="right"
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: 0,
                    borderBottom: 'none',
                  }}
                >
                  {result.points}
                </TableCell>
                <TableCell align="right">
                  {pointsMap[result.position]}
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default RaceResultsTable
