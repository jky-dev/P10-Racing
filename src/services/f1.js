import axios from 'axios'
import { getDatabase, set, ref } from 'firebase/database'

export const fetchRaces = () => {
  const db = getDatabase()

  axios.get('http://ergast.com/api/f1/current.json').then((res) => {
    const races = res.data.MRData.RaceTable.Races

    set(ref(db, '/' + 'races'), races)
  })
}
