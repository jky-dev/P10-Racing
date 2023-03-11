import axios from 'axios'
import { getDatabase, set, ref } from 'firebase/database'

export const setRaces = () => {
  const db = getDatabase()

  axios.get('http://ergast.com/api/f1/current.json').then((res) => {
    const races = res.data.MRData.RaceTable.Races

    set(ref(db, '/' + 'races'), races)
  })
}

export const setRaceResultsByRound = (round: number) => {
  const db = getDatabase()

  axios
    .get(`http://ergast.com/api/f1/2023/${round}/results.json`)
    .then((res) => {
      const results = res.data.MRData.RaceTable.Races[0].Results
      const index = round - 1

      set(ref(db, '/results/' + index), results)
    })
}
