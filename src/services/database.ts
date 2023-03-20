import { SupabaseClient, User } from '@supabase/supabase-js'
import {
  F1ConstructorsApiProps,
  F1DriversApiProps,
  F1RaceApiProps,
  F1ResultsApiProps,
  InviteCodeDbProps,
  LeagueMembersDbProps,
  LeaguesProps,
} from '../interfaces'

export const createLeague = async (
  client: SupabaseClient,
  user: any,
  name: string,
  code: string
) => {
  const { data: league_data, error } = await client
    .from('leagues')
    .insert([
      {
        name: name,
        invite_code: code,
        created_by_uuid: user.id,
      },
    ])
    .select()

  if (error || league_data.length === 0) throw new Error('An error occurred')

  const returnedRecord = league_data[0] as LeaguesProps

  await client.from('invite_codes').insert({
    invite_code: code,
    league_id: returnedRecord.id,
    created_by_uuid: user.id,
  })

  await addUserToLeague(client, returnedRecord.id, user.id)
}

export const joinLeague = async (
  client: SupabaseClient,
  user: User,
  code: string
) => {
  const { data } = await client
    .from('invite_codes')
    .select('league_id')
    .eq('invite_code', code)

  if ((data as InviteCodeDbProps[]).length !== 1)
    throw new Error('League invite not found')

  const leagueId = (data as InviteCodeDbProps[])[0].league_id

  const { data: check } = await client
    .from('league_members')
    .select('id')
    .eq('league_id', leagueId)
    .eq('user_uuid', user.id)

  if ((check as LeagueMembersDbProps[]).length !== 0)
    throw new Error('You are already part of this league')

  await addUserToLeague(client, leagueId, user.id)
}

const addUserToLeague = async (
  client: SupabaseClient,
  leagueId: number,
  userId: string
) => {
  await client.from('league_members').insert({
    league_id: leagueId,
    user_uuid: userId,
    index: `${leagueId}_${userId}`,
  })

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
    { onConflict: 'unique_index', ignoreDuplicates: true }
  )
}

export const getRaceByRoundNumber = async (
  client: SupabaseClient,
  roundNumber: number
) => {
  return await client.from('races').select('id').eq('round_number', roundNumber)
}

export const getRaceResultsByRaceId = async (
  client: SupabaseClient,
  raceId: number
) => {
  return await client.from('race_results').select('*').eq('race_id', raceId)
}

export const getTable = async (client: SupabaseClient, table: string) => {
  return await client.from(table).select('*')
}

export const getTableWithColumn = async (
  client: SupabaseClient,
  table: string,
  columnName: string,
  match: any
) => {
  return await client.from(table).select('*').eq(columnName, match)
}

export const getRaceResultsByRound = async (
  client: SupabaseClient,
  roundNumber: number
) => {
  const { data } = await getRaceByRoundNumber(client, roundNumber)
  const raceId: number = data[0].id

  return await getRaceResultsByRaceId(client, raceId)
}
