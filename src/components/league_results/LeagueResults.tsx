import { Typography } from '@mui/material'
import React from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import {
  DriversDbProps,
  LeagueResultsDbProps,
  RacesDbProps,
} from '../../interfaces'
import Loader from '../loader/Loader'
import styles from './LeagueResults.module.scss'
import Picker from './Picker/Picker'

interface LeagueResultsProps {
  leagueId: number
}

const LeagueResults: React.FC<LeagueResultsProps> = ({ leagueId }) => {
  const [results, setResults] = React.useState<LeagueResultsDbProps[] | null>(
    null
  )
  const [loading, setLoading] = React.useState(false)
  const { client, user } = useSupabaseContext()
  const [drivers, setDrivers] = React.useState<Map<
    number,
    DriversDbProps
  > | null>(null)
  const [settingMap, setSettingMap] = React.useState(false)
  const [leagueMembers, setLeagueMembers] = React.useState<string[]>([])

  const fetchResults = async () => {
    setLoading(true)
    const { data }: { data: LeagueResultsDbProps[] } = await client
      .from('league_results')
      .select(
        `
          *,
          races (race_name, round_number, year, date, time),
          leagues (name, invite_code)
        `
      )
      .eq('league_id', leagueId)

    console.log(data)

    const personalResults = data.filter((value) => value.user_uuid === user.id)

    const { data: leagueMembers }: { data: LeagueResultsDbProps[] } =
      await client
        .from('league_members')
        .select(
          `*,
            users (*)
          `
        )
        .eq('league_id', leagueId)

    console.log(leagueMembers)
    setLeagueMembers(leagueMembers.map((member) => member.users.name))

    setResults(personalResults)
    setLoading(false)
  }

  const fetchDrivers = async () => {
    setSettingMap(true)
    const { data }: { data: DriversDbProps[] } = await client
      .from('drivers')
      .select('*')
    const driversMap = new Map()
    data.forEach((driver) => {
      driversMap.set(driver.id, driver)
    })
    setDrivers(driversMap)
    setSettingMap(false)
  }

  const disabled = (race: RacesDbProps) => {
    const raceDate = Date.parse(`${race.date} ${race.time}`)
    return raceDate < Date.now()
  }

  const submitDriver = async (driverId: number, rowId: number) => {
    const { error } = await client
      .from('league_results')
      .update({
        driver_id: driverId,
      })
      .eq('id', rowId)

    if (!error) console.log('updated', driverId, rowId)
  }

  React.useEffect(() => {
    if (leagueId === null) return
    fetchResults()
    fetchDrivers()
  }, [leagueId])

  if (leagueId === null) return null

  if (loading || settingMap) return <Loader />

  if (results === null) return null

  return (
    <div>
      <div className={styles.memberContainer}>
        <Typography variant="h4">Members</Typography>
        {leagueMembers.map((member) => (
          <Typography key={member}>{member}</Typography>
        ))}
      </div>
      <Typography variant="h4">Results</Typography>
      <Typography>Invite code: {results[0].leagues.invite_code}</Typography>
      <div>
        {results.length !== 23 && <div>Error</div>}
        {results
          .sort((a, b) => a.races.round_number - b.races.round_number)
          .map((result) => (
            <div key={result.races.race_name}>
              <Typography>
                {result.races.round_number}. {result.races.race_name}
              </Typography>
              <Picker
                id={result.races.race_name}
                rowId={result.id}
                drivers={drivers}
                submitHandler={submitDriver}
                preSelectedDriver={result.driver_id}
                disabled={disabled(result.races)}
              />
            </div>
          ))}
      </div>
    </div>
  )
}

export default LeagueResults
