import React from 'react'
import { useSupabaseContext } from '../../contexts/SupabaseContext'
import {
  DriversDbProps,
  LeagueResultsDbProps,
  RacesDbProps,
} from '../../interfaces'
import Loader from '../loader/Loader'
import Picker from './Picker'

interface LeagueResultsProps {
  leagueId: string
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

  const fetchResults = async () => {
    setLoading(true)
    const { data }: { data: LeagueResultsDbProps[] } = await client
      .from('league_results')
      .select(
        `
          id, driver_id, race_id, index, league_id,
          races (race_name, round_number, year, date, time),
          leagues (name, invite_code)
        `
      )
      .eq('league_id', leagueId)
      .eq('user_uuid', user.id)

    setResults(data)
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

  const showPicker = (race: RacesDbProps) => {
    const raceDate = Date.parse(`${race.date} ${race.time}`)
    return raceDate > Date.now()
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
      Results
      <div>Invite code: {results[0].leagues.invite_code}</div>
      <div>
        {results.length !== 23 && <div>Error</div>}
        {results
          .sort((a, b) => a.races.round_number - b.races.round_number)
          .map((result) => (
            <div key={result.races.race_name}>
              <h4>
                {result.races.round_number}.{result.races.race_name}
              </h4>
              {showPicker(result.races) ? (
                <Picker
                  id={result.races.race_name}
                  rowId={result.id}
                  drivers={drivers}
                  submitHandler={submitDriver}
                  preSelectedDriver={result.driver_id}
                />
              ) : (
                <h5>Pick: {drivers.get(result.driver_id)?.given_name}</h5>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}

export default LeagueResults
