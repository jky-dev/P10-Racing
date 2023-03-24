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
import { useUtilsContext } from '../../../contexts/UtilsContext'
import { driverName } from '../../../helpers/helpers'
import { RaceResultsDbProps } from '../../../interfaces'
import styles from './RaceResultsTable.module.scss'

interface RaceResultsTable {
  raceResults: RaceResultsDbProps[]
}

const RaceResultsTable: React.FC<RaceResultsTable> = ({ raceResults }) => {
  const { driversIdMap } = useSupabaseContext()
  const { pointsMap } = useUtilsContext()
  const isMobile = useMediaQuery('(max-width:600px)')
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
      <TableBody>
        {raceResults.map((result) => (
          <TableRow key={result.driver_id}>
            <TableCell>{result.position}.</TableCell>
            <TableCell
              sx={{
                maxWidth: 0,
                verticalAlign: 'middle',
              }}
              align="right"
            >
              <div className={styles.driverName}>
                <span className={styles.text}>
                  {driverName(
                    driversIdMap.get(result.driver_id),
                    isMobile,
                    '-',
                    true
                  )}
                </span>
                <img
                  src={`/images/${
                    driversIdMap.get(result.driver_id).constructor
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
                  }}
                >
                  {result.points}
                </TableCell>
                <TableCell align="right">
                  {pointsMap.get(result.position)}
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
