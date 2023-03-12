import { SupabaseClient } from '@supabase/supabase-js'
import axios from 'axios'
import {
  F1ConstructorsApiProps,
  F1DriversApiProps,
  F1RaceApiProps,
  F1ResultsApiProps,
} from '../interfaces'
import {
  getRaceByRound,
  insertIntoConstructors,
  insertIntoDrivers,
  insertIntoRaces,
  updateRaceResultWithFinish,
} from './database'

export const setRaces = (client: SupabaseClient) => {
  axios.get('http://ergast.com/api/f1/current.json').then((res) => {
    const races: F1RaceApiProps[] = res.data.MRData.RaceTable.Races

    races.forEach((race) => {
      insertIntoRaces(client, race)
    })
  })
}

export const setConstructors = (client: SupabaseClient) => {
  axios.get('http://ergast.com/api/f1/2023/constructors.json').then((res) => {
    const constructors: F1ConstructorsApiProps[] =
      res.data.MRData.ConstructorTable.Constructors

    constructors.forEach((constructor) => {
      insertIntoConstructors(client, constructor)
    })
  })
}

export const setDrivers = (client: SupabaseClient) => {
  axios.get('http://ergast.com/api/f1/2023/drivers.json').then((res) => {
    const drivers: F1DriversApiProps[] = res.data.MRData.DriverTable.Drivers

    drivers.forEach((driver) => {
      insertIntoDrivers(client, driver)
    })
  })
}

export const setRaceResultsByRound = (
  client: SupabaseClient,
  round: number
) => {
  if (round < 1) return

  axios
    .get(`http://ergast.com/api/f1/2023/${round}/results.json`)
    .then(async (res) => {
      const results: F1ResultsApiProps[] =
        res.data.MRData.RaceTable.Races[0].Results

      const race = await getRaceByRound(client, round)

      results.forEach((result) => {
        updateRaceResultWithFinish(client, result, race.data[0].id)
      })
    })
}
