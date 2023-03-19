import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import React, { createContext, ReactNode } from 'react'
import { DriversDbProps, RaceResultsDbProps, RacesDbProps } from '../interfaces'

const SupabaseContext = createContext(null)

SupabaseContext.displayName = 'Supabase Context'

const useContext = () => {
  const [user, setUser] = React.useState<User | null>(null)
  const [driversMap, setDriversMap] = React.useState<Map<
    number,
    DriversDbProps
  > | null>(null)
  const [racesMap, setRacesMap] = React.useState<Map<
    number,
    RacesDbProps
  > | null>(null)
  const [raceResultsMap, setRaceResultsMap] = React.useState<Map<
    number,
    RaceResultsDbProps[]
  > | null>(null)
  const [driversIdMap, setDriverIdMap] = React.useState<Map<
    string,
    DriversDbProps
  > | null>(null)
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
      const defaultName = user.email.split('@')[0]

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
    const { data: drivers }: { data: DriversDbProps[] } = await client
      .from('drivers')
      .select('*')

    const { data: dbRaces }: { data: RacesDbProps[] } = await client
      .from('races')
      .select('*')

    const { data: raceResults }: { data: RaceResultsDbProps[] } = await client
      .from('race_results')
      .select('*')

    const rrMap = new Map<number, RaceResultsDbProps[]>()
    const rMap = new Map()
    for (const race of dbRaces) {
      rMap.set(race.id, race)
      rrMap.set(race.id, [])
    }
    for (const raceResult of raceResults) {
      rrMap.get(raceResult.race_id).push(raceResult)
    }
    setRacesMap(rMap)
    setRaces(dbRaces)
    setRaceResultsMap(rrMap)

    const dMap = new Map()
    const dIdMap = new Map()
    for (const driver of drivers) {
      dMap.set(driver.id, driver)
      dIdMap.set(driver.driver_id, driver)
    }
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
    races,
    loading,
  }
}

interface Props {
  children?: ReactNode
}

export interface SupabaseContextProps {
  client: SupabaseClient
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  driversMap: Map<number, DriversDbProps>
  racesMap: Map<number, RacesDbProps>
  raceResultsMap: Map<number, RaceResultsDbProps[]>
  races: RacesDbProps[]
  driversIdMap: Map<string, DriversDbProps>
  loading: boolean
}

export const useSupabaseContext = () => {
  const context = React.useContext(SupabaseContext)

  if (context === undefined) {
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
