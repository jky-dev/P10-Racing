import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  useMediaQuery,
} from '@mui/material'
import React from 'react'

export interface HeaderData {
  header: string
  mobileHeader?: string
  width?: string
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
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const isMobile = useMediaQuery('(max-width:600px)')

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowData.length) : 0

  const visibleRows = React.useMemo(
    () => rowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage]
  )

  const secondVisibleRows = React.useMemo(
    () =>
      secondRowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage]
  )

  const emptyRowHeight = secondRowData ? 32 * emptyRows * 2 : 32 * emptyRows

  return (
    <>
      <Table sx={{ width: '100%', overflow: 'auto' }} size="small">
        <TableHead>
          <TableRow>
            {headerData.map((header, index) => (
              <TableCell
                align={index === 0 ? 'left' : 'right'}
                sx={{ width: header.width }}
              >
                {isMobile
                  ? header.mobileHeader ?? header.header
                  : header.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((row, i) => (
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
                  {secondVisibleRows[i].map((row, index) => (
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
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: emptyRowHeight,
              }}
            >
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  )
}

export default DataTable
