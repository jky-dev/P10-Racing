import axios from 'axios'

export const setRaces = () => {
  axios.get('http://ergast.com/api/f1/current.json').then((res) => {
    const races = res.data.MRData.RaceTable.Races
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
