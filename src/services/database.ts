import { SupabaseClient } from '@supabase/supabase-js'
import { useSupabaseContext } from '../contexts/SupabaseContext'
import {
  F1ConstructorsApiProps,
  F1DriversApiProps,
  F1RaceApiProps,
  F1ResultsApiProps,
  LeaguesProps,
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

  await addUserToLeague(client, returnedRecord.id, user.id)
}

export const joinLeague = async (
  client: SupabaseClient,
  user: any,
  code: string
) => {
  const { data }: { data: { id: number }[] } = await client
    .from('leagues')
    .select('id')
    .eq('invite_code', code)

  if (data.length !== 1) return

  const leagueId = data[0].id

  const { data: check } = await client
    .from('league_members')
    .select('*')
    .eq('league_id', leagueId)
    .eq('user_uuid', user.id)

  if (check.length !== 0) return

  await addUserToLeague(client, leagueId, user.id)
}

const addUserToLeague = async (
  client: SupabaseClient,
  leagueId: number,
  userId: string
) => {
  await client.from('league_members').upsert(
    [
      {
        league_id: leagueId,
        user_uuid: userId,
        index: `${leagueId}_${userId}`,
      },
    ],
    { onConflict: 'index', ignoreDuplicates: true }
  )

  // race ids just happen to be 1 -> 23
  for (let i = 1; i < 24; i++) {
    await client.from('league_results').upsert(
      {
        race_id: i,
        driver_id: null,
        points_gained: null,
        league_id: leagueId,
        user_uuid: userId,
        index: `${i}_${leagueId}_${userId}`,
      },
      { onConflict: 'index', ignoreDuplicates: true }
    )
  }
}

export const insertIntoRaces = async (
  client: SupabaseClient,
  race: F1RaceApiProps
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
  constructor: F1ConstructorsApiProps
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
  driver: F1DriversApiProps
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
  result: F1ResultsApiProps,
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
