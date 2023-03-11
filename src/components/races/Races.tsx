import React, { useState } from 'react'
import { RacesProps } from '../../interfaces'
import { fetchPath } from '../../services/database'
import Loader from '../loader/Loader'

const Races: React.FC = () => {
  const [races, setRaces] = useState<null | RacesProps[]>(null)
  const [loading, setLoading] = useState(true)

  const init = async () => {
    setLoading(true)
    const dbRaces: Array<RacesProps> = await fetchPath('races')

    setRaces(dbRaces)
    setLoading(false)
  }

  React.useEffect(() => {
    init()
  }, [])

  return <>{loading ? <Loader /> : races.map((v) => <div>{v.raceName}</div>)}</>
}

export default Races
