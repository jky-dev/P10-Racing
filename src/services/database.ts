import { SupabaseClient } from '@supabase/supabase-js'
import { useSupabaseContext } from '../contexts/SupabaseContext'
import {
  ConstructorsApiProps,
  DriversApiProps,
  LeaguesProps,
  RaceApiProps,
  ResultsApiProps,
} from '../interfaces'

export const test = async () => {
  const { client } = useSupabaseContext()
  const { data, error } = await client.from('constructor').select('*')
  console.log(data)
}

export const createLeague = async (
  client: SupabaseClient,
  user: any,
  name: string,
  code: string
) => {
  const { data: league_data } = await client
    .from('leagues')
    .insert([
      {
        name: name,
        invite_code: code,
        created_by_uuid: user.id,
      },
    ])
    .select()

  const returnedRecord = league_data[0] as LeaguesProps

  await client
    .from('league_members')
    .insert([{ league_id: returnedRecord.id, user_uuid: user.id }])

  for (let i = 1; i < 24; i++) {
    await client.from('league_results').upsert({
      race_id: i,
      driver_id: null,
      points_gained: null,
      league_id: returnedRecord.id,
      user_uuid: user.id,
    })
  }
}

export const insertIntoRaces = async (
  client: SupabaseClient,
  race: RaceApiProps
) => {
  await client.from('races').upsert(
    [
      {
        race_name: race.raceName,
        round_number: race.round,
        year: race.season,
        date: race.date,
        time: race.time,
      },
    ],
    { onConflict: 'race_name', ignoreDuplicates: true }
  )
}

export const insertIntoConstructors = async (
  client: SupabaseClient,
  constructor: ConstructorsApiProps
) => {
  await client.from('constructor').upsert(
    [
      {
        constructor_id: constructor.constructorId,
        name: constructor.name,
      },
    ],
    { onConflict: 'constructor_id', ignoreDuplicates: true }
  )
}

export const insertIntoDrivers = async (
  client: SupabaseClient,
  driver: DriversApiProps
) => {
  await client.from('drivers').upsert(
    [
      {
        driver_id: driver.driverId,
        last_name: driver.familyName,
        given_name: driver.givenName,
      },
    ],
    { onConflict: 'driver_id', ignoreDuplicates: true }
  )
}

export const updateRaceResultWithFinish = async (
  client: SupabaseClient,
  result: ResultsApiProps,
  race_id: number
) => {
  await client.from('race_results').upsert(
    [
      {
        race_id: race_id,
        position: result.position,
        status: result.status,
        driver_id: result.Driver.driverId,
        unique_index: race_id + result.Driver.driverId,
      },
    ],
    { onConflict: 'unique_index', ignoreDuplicates: false }
  )
}

export const getRaceByRound = async (client: SupabaseClient, round: number) => {
  return await client.from('races').select('id').eq('round_number', round)
}
