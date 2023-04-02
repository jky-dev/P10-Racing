import { SupabaseClient, User, createClient } from '@supabase/supabase-js'
import React, { ReactNode, createContext } from 'react'

import { pointsMap } from '../helpers/helpers'
import {
  DriverId,
  DriverIdString,
  DriversDbProps,
  QualiDbProps,
  RaceId,
  RaceResultsDbProps,
  RacesDbProps,
} from '../interfaces'

const SupabaseContext = createContext<SupabaseContextProps | null>(null)

SupabaseContext.displayName = 'Supabase Context'

const useContext: () => SupabaseContextProps | null = () => {
  const [user, setUser] = React.useState<User | null>(null)
  const [driversMap, setDriversMap] = React.useState<
    Map<DriverId, DriversDbProps>
  >(new Map())
  const [racesMap, setRacesMap] = React.useState<Map<RaceId, RacesDbProps>>(
    new Map()
  )
  const [raceResultsMap, setRaceResultsMap] = React.useState<
    Map<RaceId, RaceResultsDbProps[]>
  >(new Map())
  const [raceResultsDriverMap, setRaceResultsDriverMap] = React.useState<
    Map<RaceId, Map<DriverId, RaceResultsDbProps>>
  >(new Map())
  const [driversIdMap, setDriverIdMap] = React.useState<
    Map<DriverIdString, DriversDbProps>
  >(new Map())
  const [qualiResultsMap, setQualiResultsMap] = React.useState<
    Map<RaceId, QualiDbProps[]>
  >(new Map())
  const [p10PointsMap, setP10PointsMap] = React.useState<Map<DriverId, number>>(
    new Map()
  )
  const [races, setRaces] = React.useState<RacesDbProps[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabaseUrl = 'https://msrqldgafbaagfcxbcyv.supabase.co'
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcnFsZGdhZmJhYWdmY3hiY3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg1OTE1NjYsImV4cCI6MTk5NDE2NzU2Nn0.5zGGuJVpBoYLUCr53Haz671UMJw0AtFAHJo9giqnYYA'

  const client = createClient(supabaseUrl, supabaseKey)

  const checkReset = async () => {
    client.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        localStorage.setItem('reset', 'true')
      }
    })
  }

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
    const { data: drivers }: any = await client
      .from('drivers')
      .select('*')
      .not('id', 'eq', 241)
      .order('constructor')
      .order('id')

    const { data: dbRaces } = await client
      .from('races')
      .select('*')
      .order('round_number', { ascending: true })

    const { data: raceResults } = await client
      .from('race_results')
      .select('*')
      .order('position', { ascending: true })

    const { data: qualiResults } = await client
      .from('quali_results')
      .select('*')
      .order('race_id', { ascending: true })
      .order('position', { ascending: true })

    if (!drivers || !dbRaces || !raceResults || !qualiResults)
      throw new Error('failed to initialize')

    const dMap = new Map<number, DriversDbProps>()
    const dIdMap = new Map<string, DriversDbProps>()
    const p10DriverTotalPointsMap = new Map<DriverId, number>()
    for (const driver of drivers as DriversDbProps[]) {
      dMap.set(driver.id, driver)
      dIdMap.set(driver.driver_id, driver)
      p10DriverTotalPointsMap.set(driver.id, 0)
    }

    const rrdMap = new Map<number, Map<number, RaceResultsDbProps>>()
    const rrMap = new Map<number, RaceResultsDbProps[]>()
    const rMap = new Map()
    const qMap = new Map<number, QualiDbProps[]>()
    for (const race of dbRaces as RacesDbProps[]) {
      rMap.set(race.id, race)
      rrMap.set(race.id, [])
      qMap.set(race.id, [])
      rrdMap.set(race.id, new Map<number, RaceResultsDbProps>())
    }
    for (const raceResult of raceResults as RaceResultsDbProps[]) {
      rrMap.get(raceResult.race_id)!.push(raceResult)
      rrdMap.get(raceResult.race_id).set(raceResult.driver_id, raceResult)
      if (raceResult.position) {
        p10DriverTotalPointsMap.set(
          raceResult.driver_id,
          p10DriverTotalPointsMap.get(raceResult.driver_id) +
            pointsMap[raceResult.position]
        )
      }
    }
    for (const qualiResult of qualiResults as QualiDbProps[]) {
      qMap.get(qualiResult.race_id).push(qualiResult)
    }
    setRacesMap(rMap)
    setRaces(dbRaces as RacesDbProps[])
    setRaceResultsMap(rrMap)
    setRaceResultsDriverMap(rrdMap)

    setDriversMap(dMap)
    setDriverIdMap(dIdMap)

    setQualiResultsMap(qMap)

    setP10PointsMap(p10DriverTotalPointsMap)
  }

  const loadDetails = async () => {
    await checkReset()
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
    qualiResultsMap,
    p10PointsMap,
  }
}

interface Props {
  children?: ReactNode
}

export interface SupabaseContextProps {
  client: SupabaseClient
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  driversMap: Map<DriverId, DriversDbProps>
  driversIdMap: Map<DriverIdString, DriversDbProps>
  racesMap: Map<RaceId, RacesDbProps>
  raceResultsMap: Map<RaceId, RaceResultsDbProps[]>
  raceResultsDriverMap: Map<RaceId, Map<DriverId, RaceResultsDbProps>>
  races: RacesDbProps[]
  loading: boolean
  qualiResultsMap: Map<RaceId, QualiDbProps[]>
  p10PointsMap: Map<DriverId, number>
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
