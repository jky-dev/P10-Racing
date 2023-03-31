import { SupabaseClient, User } from '@supabase/supabase-js'

import {
  DriversDbProps,
  F1ConstructorsApiProps,
  F1DriversApiProps,
  F1QualifyingApiProps,
  F1RaceApiProps,
  F1ResultsApiProps,
  InviteCodeDbProps,
} from '../interfaces'

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

  const { error } = await client.rpc('join_league', {
    i_code: code,
  })

  if (error) throw new Error('An error joining the league as occured')
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
        fp1_date: race.FirstPractice.date,
        fp1_time: race.FirstPractice.time,
        fp2_date: race.SecondPractice.date,
        fp2_time: race.SecondPractice.time,
        fp3_date: race.ThirdPractice?.date,
        fp3_time: race.ThirdPractice?.time,
        sprint_date: race.Sprint?.date,
        sprint_time: race.Sprint?.time,
        quali_date: race.Qualifying.date,
        quali_time: race.Qualifying.time,
      },
    ],
    { onConflict: 'race_name', ignoreDuplicates: false }
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
  race_id: number,
  driversIdMap: Map<string, DriversDbProps>
) => {
  await client.from('race_results').upsert(
    [
      {
        race_id: race_id,
        position: result.position,
        status: result.status,
        driver_id: driversIdMap.get(result.Driver.driverId).id,
        unique_index: `${race_id}_${
          driversIdMap.get(result.Driver.driverId).id
        }`,
        points: result.points,
      },
    ],
    { onConflict: 'unique_index', ignoreDuplicates: false }
  )
}

export const updateQualiResultWithFinish = async (
  client: SupabaseClient,
  result: F1QualifyingApiProps,
  race_id: number,
  driverId: number
) => {
  await client.from('quali_results').upsert(
    [
      {
        race_id: race_id,
        position: result.position,
        driver_id: driverId,
        unique_index: `${race_id}_${driverId}`,
        q1: result.Q1,
        q2: result.Q2,
        q3: result.Q3,
      },
    ],
    { onConflict: 'unique_index', ignoreDuplicates: false }
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

export const getRaceResultsByRound = async (
  client: SupabaseClient,
  roundNumber: number
) => {
  const { data } = await getRaceByRoundNumber(client, roundNumber)
  const raceId: number = data[0].id

  return await getRaceResultsByRaceId(client, raceId)
}
