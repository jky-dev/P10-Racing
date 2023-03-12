import { SupabaseClient } from '@supabase/supabase-js'
import axios from 'axios'
import { ConstructorsApiProps, RaceApiProps } from '../interfaces'
import { insertIntoConstructors, insertIntoRaces } from './database'

export const setRaces = (client: SupabaseClient) => {
  axios.get('http://ergast.com/api/f1/current.json').then((res) => {
    const races: RaceApiProps[] = res.data.MRData.RaceTable.Races

    races.forEach((race) => {
      insertIntoRaces(client, race)
    })
  })
}

export const setConstructors = (client: SupabaseClient) => {
  axios.get('http://ergast.com/api/f1/2023/constructors.json').then((res) => {
    const constructors: ConstructorsApiProps[] =
      res.data.MRData.ConstructorTable.Constructors

    constructors.forEach((constructor) => {
      insertIntoConstructors(client, constructor)
    })
  })
}

export const setRaceResultsByRound = (round: number) => {
  if (round < 1) return

  axios
    .get(`http://ergast.com/api/f1/2023/${round}/results.json`)
    .then((res) => {
      const results = res.data.MRData.RaceTable.Races[0].Results
      const index = round - 1
    })
}
