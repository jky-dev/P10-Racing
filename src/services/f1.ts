import { SupabaseClient } from '@supabase/supabase-js'
import axios from 'axios'

import {
  DriversDbProps,
  F1ConstructorsApiProps,
  F1DriversApiProps,
  F1QualifyingApiProps,
  F1RaceApiProps,
  F1ResultsApiProps,
} from '../interfaces'
import {
  getRaceByRoundNumber,
  insertIntoConstructors,
  insertIntoDrivers,
  insertIntoRaces,
  updateQualiResultWithFinish,
  updateRaceResultWithFinish,
} from './database'

export const setRaces = (client: SupabaseClient) => {
  axios.get('https://ergast.com/api/f1/current.json').then((res) => {
    const races: F1RaceApiProps[] = res.data.MRData.RaceTable.Races

    console.log(races)
    // races.forEach((race) => {
    //   insertIntoRaces(client, race)
    // })
  })
}

export const setConstructors = (client: SupabaseClient) => {
  axios.get('https://ergast.com/api/f1/2024/constructors.json').then((res) => {
    const constructors: F1ConstructorsApiProps[] =
      res.data.MRData.ConstructorTable.Constructors

    console.log(constructors)

    // TODO - DOUBLE CHECK ERGAST API CONSTRUCTORS AGAINST DB RESULTS for 2024
    // const tempConstructors = [
    //   {
    //     constructorId: 'alpine',
    //     name: 'BWT Alpine F1 Team',
    //   },
    //   {
    //     constructorId: 'aston_martin',
    //     name: 'Aston Martin Aramco F1 Team',
    //   },
    //   {
    //     constructorId: 'ferrari',
    //     name: 'Scuderia Ferrari',
    //   },
    //   {
    //     constructorId: 'haas',
    //     name: 'MoneyGram Haas F1 Team',
    //   },
    //   {
    //     constructorId: 'kick_sauber',
    //     name: 'Stake F1 Team Kick Sauber',
    //   },
    //   {
    //     constructorId: 'mclaren',
    //     name: '	McLaren Formula 1 Team',
    //   },
    //   {
    //     constructorId: 'mercedes',
    //     name: 'Mercedes-AMG PETRONAS F1 Team',
    //   },
    //   {
    //     constructorId: 'rb',
    //     name: 'Visa Cash App RB Formula One Team',
    //   },
    //   {
    //     constructorId: 'red_bull',
    //     name: 'Oracle Red Bull Racing',
    //   },
    //   {
    //     constructorId: 'williams',
    //     name: 'Williams Racing',
    //   },
    // ]

    // constructors.forEach((constructor) => {
    //   insertIntoConstructors(client, constructor)
    // })
  })
}

export const setDrivers = (client: SupabaseClient) => {
  axios.get('https://ergast.com/api/f1/2024/drivers.json').then((res) => {
    const drivers: F1DriversApiProps[] = res.data.MRData.DriverTable.Drivers

    console.log(drivers)
    // drivers.forEach((driver) => {
    //   insertIntoDrivers(client, driver)
    // })
  })
}

export const setRaceResultsByRound = (
  client: SupabaseClient,
  round: number,
  driversIdMap: Map<string, DriversDbProps>
) => {
  if (round < 1) return

  const year = 2024

  return axios
    .get(`https://ergast.com/api/f1/${year}/${round}/results.json`)
    .then(async (res) => {
      const results: F1ResultsApiProps[] =
        res.data.MRData.RaceTable.Races[0].Results

      const race = await getRaceByRoundNumber(client, round)

      results.forEach((result) => {
        updateRaceResultWithFinish(
          client,
          result,
          race.data[0].id,
          driversIdMap,
          year
        )
      })
    })
}

export const setQualiResultsByRound = (
  client: SupabaseClient,
  round: number,
  driversIdMap: Map<string, DriversDbProps>
) => {
  if (round < 1) return

  const year = 2024

  return axios
    .get(`https://ergast.com/api/f1/${year}/${round}/qualifying.json`)
    .then(async (res) => {
      const results: F1QualifyingApiProps[] =
        res.data.MRData.RaceTable.Races[0].QualifyingResults

      const race = await getRaceByRoundNumber(client, round)

      results.forEach((result) => {
        updateQualiResultWithFinish(
          client,
          result,
          race.data[0].id,
          driversIdMap.get(result.Driver.driverId).id,
          year
        )
      })
    })
}
