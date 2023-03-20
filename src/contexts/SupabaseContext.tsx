import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import React, { createContext, ReactNode } from 'react'
import { DriversDbProps, RaceResultsDbProps, RacesDbProps } from '../interfaces'

const SupabaseContext = createContext<SupabaseContextProps | null>(null)

SupabaseContext.displayName = 'Supabase Context'

const useContext: () => SupabaseContextProps | null = () => {
  const [user, setUser] = React.useState<User | null>(null)
  const [driversMap, setDriversMap] = React.useState<
    Map<number, DriversDbProps>
  >(new Map())
  const [racesMap, setRacesMap] = React.useState<Map<number, RacesDbProps>>(
    new Map()
  )
  const [raceResultsMap, setRaceResultsMap] = React.useState<
    Map<number, RaceResultsDbProps[]>
  >(new Map())
  const [raceResultsDriverMap, setRaceResultsDriverMap] = React.useState<
    Map<number, Map<number, RaceResultsDbProps>>
  >(new Map())
  const [driversIdMap, setDriverIdMap] = React.useState<
    Map<string, DriversDbProps>
  >(new Map())
  const [races, setRaces] = React.useState<RacesDbProps[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabaseUrl = 'https://msrqldgafbaagfcxbcyv.supabase.co'
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcnFsZGdhZmJhYWdmY3hiY3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg1OTE1NjYsImV4cCI6MTk5NDE2NzU2Nn0.5zGGuJVpBoYLUCr53Haz671UMJw0AtFAHJo9giqnYYA'

  const client = createClient(supabaseUrl, supabaseKey)

  const checkUser = async () => {
    const {
      data: { user },
    } = await client.auth.getUser()
    if (user) {
      const defaultName = user.email?.split('@')[0]

      try {
        await client
          .from('users')
          .upsert(
            { email: user.email, uuid: user.id, name: defaultName },
            { onConflict: 'uuid', ignoreDuplicates: true }
          )
      } catch (exception) {}
    }
    setUser(user)
  }

  const setData = async () => {
    const { data: drivers }: { data: DriversDbProps[] | null } = await client
      .from('drivers')
      .select('*')

    const { data: dbRaces }: { data: RacesDbProps[] | null } = await client
      .from('races')
      .select('*')

    const { data: raceResults }: { data: RaceResultsDbProps[] | null } =
      await client.from('race_results').select('*')

    if (!drivers || !dbRaces || !raceResults)
      throw new Error('failed to initialize')

    const dMap = new Map<number, DriversDbProps>()
    const dIdMap = new Map<string, DriversDbProps>()
    for (const driver of drivers) {
      dMap.set(driver.id, driver)
      dIdMap.set(driver.driver_id, driver)
    }

    const rrdMap = new Map<number, Map<number, RaceResultsDbProps>>()
    const rrMap = new Map<number, RaceResultsDbProps[]>()
    const rMap = new Map()
    for (const race of dbRaces.sort(
      (a, b) => a.round_number - b.round_number
    )) {
      rMap.set(race.id, race)
      rrMap.set(race.id, [])
      rrdMap.set(race.id, new Map<number, RaceResultsDbProps>())
    }
    for (const raceResult of raceResults) {
      rrMap.get(raceResult.race_id)!.push(raceResult)
      rrdMap
        .get(raceResult.race_id)
        .set(dIdMap.get(raceResult.driver_id).id, raceResult)
    }
    setRacesMap(rMap)
    setRaces(dbRaces)
    setRaceResultsMap(rrMap)
    setRaceResultsDriverMap(rrdMap)

    setDriversMap(dMap)
    setDriverIdMap(dIdMap)
  }

  const loadDetails = async () => {
    await checkUser()
    await setData()
    setLoading(false)
  }

  React.useEffect(() => {
    setLoading(true)
    loadDetails()
  }, [])

  return {
    client,
    user,
    setUser,
    driversMap,
    driversIdMap,
    racesMap,
    raceResultsMap,
    raceResultsDriverMap,
    races,
    loading,
  }
}

interface Props {
  children?: ReactNode
}

export interface SupabaseContextProps {
  client: SupabaseClient
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  driversMap: Map<number, DriversDbProps>
  driversIdMap: Map<string, DriversDbProps>
  racesMap: Map<number, RacesDbProps>
  raceResultsMap: Map<number, RaceResultsDbProps[]>
  raceResultsDriverMap: Map<number, Map<number, RaceResultsDbProps>>
  races: RacesDbProps[]
  loading: boolean
}

export const useSupabaseContext: () => SupabaseContextProps = () => {
  const context = React.useContext(SupabaseContext)

  if (!context) {
    throw new Error(
      'Supabase Context undefined. Make sure you use the SupabaseProvider before using the context.'
    )
  }
  return context
}

export const SupabaseProvider = ({ children }: Props) => {
  const value = useContext()

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}
