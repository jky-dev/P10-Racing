import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material'
import React from 'react'

import { useSupabaseContext } from '../../../contexts/SupabaseContext'
import { driverName, formatRaceDateTime } from '../../../helpers/helpers'
import { QualiDbProps } from '../../../interfaces'
import styles from './QualiResultsTable.module.scss'

interface QualiResultsTableProps {
  qualiResults: QualiDbProps[]
}
const QualiResultsTable: React.FC<QualiResultsTableProps> = ({
  qualiResults,
}) => {
  const { driversMap } = useSupabaseContext()
  const headers = ['Position', 'Driver', 'Q1', 'Q2', 'Q3']

  const isMobile = useMediaQuery('(max-width:600px)')

  const showHeader = (index: number) => {
    if (!isMobile) return true

    if (index > 1) return false

    return true
  }

  if (!qualiResults.length) return <Typography>TBD</Typography>

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {headers.map((header, index) =>
            showHeader(index) ? (
              <TableCell align={index > 0 ? 'right' : 'left'} key={header}>
                {header}
              </TableCell>
            ) : (
              <></>
            )
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {qualiResults.map((result) => (
          <TableRow key={result.id}>
            <>
              <TableCell width="10%">{result.position}</TableCell>
              <TableCell width="50%" align="right">
                <div className={styles.driverName}>
                  <span>
                    {driverName(driversMap.get(result.driver_id), false)}
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
                  <TableCell width="15%" align="right">
                    {result.q1}
                  </TableCell>
                  <TableCell width="15%" align="right">
                    {result.q2}
                  </TableCell>
                  <TableCell width="15%" align="right">
                    {result.q3}
                  </TableCell>
                </>
              )}
            </>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default QualiResultsTable
