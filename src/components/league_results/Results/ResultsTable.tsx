import { useMediaQuery } from '@mui/material'
import React from 'react'
import { useInView } from 'react-intersection-observer'

import { useSupabaseContext } from '../../../contexts/SupabaseContext'
import { driverName } from '../../../helpers/helpers'
import {
  LeagueMembersDbProps,
  LeagueResultsDbProps,
  RacesDbProps,
} from '../../../interfaces'
import DataTable, { HeaderData, Row, RowData } from '../../table/DataTable'
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
  const [tableData, setTableData] = React.useState(null)

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
    init()
  }, [])

  const getDriver = (uuid: string) => {
    return (
      <div className={styles.driverName}>
        <span className={styles.text}>
          {driverName(
            driversMap.get(leagueResultsMap.get(uuid).get(race.id).driver_id),
            isMobile,
            '-'
          )}
        </span>
        {!!driversMap.get(
          leagueResultsMap.get(uuid).get(race.id).driver_id
        ) && (
          <img
            src={`/images/${
              driversMap.get(leagueResultsMap.get(uuid).get(race.id).driver_id)
                .constructor
            }.png`}
            height={20}
          />
        )}
      </div>
    )
  }

  const getDnfDriver = (uuid: string) => {
    return (
      <div className={styles.driverName}>
        <span className={styles.text}>
          {leagueResultsMap.get(uuid).get(race.id).dnf_driver_id === 266
            ? 'NO DNF!'
            : driverName(
                driversMap.get(
                  leagueResultsMap.get(uuid).get(race.id).dnf_driver_id
                ),
                isMobile,
                '-'
              )}
        </span>
        {driversMap.get(
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
    )
  }

  const headerData: HeaderData[] = [
    { header: 'User', width: '30%' },
    { header: 'Picks (P10/DNF)', mobileHeader: 'Picks', width: '40%' },
    { header: 'Points (Pos)', mobileHeader: 'Points', width: '30%' },
  ]
  const rows: Row[][] = []
  const secondRows: Row[][] = []

  const init = () => {
    Array.from(leagueMembers.entries()).forEach(([uuid, value]) => {
      const row: Row[] = []
      row.push({ data: value.users.name })
      row.push({ data: getDriver(uuid) })
      row.push({ data: getPointsColumn(uuid, race.id) })
      rows.push(row)
      const secondRow: Row[] = []
      secondRow.push({ data: '' })
      secondRow.push({ data: getDnfDriver(uuid) })
      secondRow.push({ data: getDnfPointsColumn(uuid, race.id) })
      secondRows.push(secondRow)
    })
    setTableData({ rows, secondRows })
  }

  if (tableData === null) return null

  return (
    <DataTable
      headerData={headerData}
      rowData={tableData.rows}
      secondRowData={tableData.secondRows}
    />
  )
}

export default ResultsTable
