import React, { useMemo } from 'react'

import { useSupabaseContext } from '../../../contexts/SupabaseContext'
import { driverName } from '../../../helpers/helpers'
import DataTable, { HeaderData, Row } from '../../table/DataTable'

const P10StandingsTable = () => {
  const { p10PointsMap, driversMap } = useSupabaseContext()
  const sortedP10Array = useMemo(
    () => Array.from(p10PointsMap.entries()).sort((a, b) => b[1] - a[1]),
    [p10PointsMap]
  )
  const [tableData, setTableData] = React.useState(null)

  const header: HeaderData[] = [
    { header: 'Rank', width: '10%' },
    { header: 'Driver' },
    { header: 'Points', width: '25%' },
  ]

  const getDriver = (driverId: number) => {
    return (
      <span className="driverConstructorContainer">
        <span className="driverName">
          {driverName(driversMap.get(driverId), false)}{' '}
        </span>
        <img
          src={`/images/${driversMap.get(driverId).constructor}.png`}
          height={20}
        />
      </span>
    )
  }

  React.useEffect(() => {
    const rows: Row[][] = []
    sortedP10Array.forEach(([driverId, points], index) => {
      const row: Row[] = []
      row.push({ data: index + 1 })
      row.push({ data: getDriver(driverId) })
      row.push({ data: points })
      rows.push(row)
    })
    setTableData(rows)
  }, [sortedP10Array])

  return !tableData ? null : (
    <DataTable headerData={header} rowData={tableData} />
  )
}

export default P10StandingsTable
