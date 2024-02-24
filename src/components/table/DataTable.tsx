import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material'
import React from 'react'

export interface HeaderData {
  header: string
  mobileHeader?: string
  width: string
}

export interface RowData {
  row: Row[]
}

export interface Row {
  data: string | React.ReactNode
  mobileData?: string | React.ReactNode
}

interface DataTableProps {
  pagination?: boolean
  headerData: HeaderData[]
  rowData: Row[][]
  secondRowData?: Row[][]
}

const DataTable = ({
  pagination = false,
  headerData,
  rowData,
  secondRowData,
}: DataTableProps) => {
  const isMobile = useMediaQuery('(max-width:600px)')

  return (
    <Table sx={{ width: '100%', overflow: 'auto' }} size="small">
      <TableHead>
        <TableRow>
          {headerData.map((header, index) => (
            <TableCell
              align={index === 0 ? 'left' : 'right'}
              sx={{ width: header.width }}
            >
              {isMobile ? header.header : header.mobileHeader ?? header.header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rowData.map((row, i) => (
          <>
            <TableRow>
              {row.map((row, index) => (
                <TableCell
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: 0,
                  }}
                  align={index > 0 ? 'right' : 'left'}
                >
                  {isMobile ? row.mobileData ?? row.data : row.data}
                </TableCell>
              ))}
            </TableRow>
            {secondRowData && (
              <TableRow>
                {secondRowData[i].map((row, index) => (
                  <TableCell
                    sx={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      maxWidth: 0,
                    }}
                    align={index > 0 ? 'right' : 'left'}
                  >
                    {isMobile ? row.mobileData ?? row.data : row.data}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  )
}

export default DataTable
