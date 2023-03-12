export interface LeaguesProps {
  created_at: string | null
  created_by_uuid: string
  id: number
  invite_code: string
  name: string
}

export interface RaceApiProps {
  Circuit: {
    circuitId: string
    circuitName: string
  }
  date: string
  raceName: string
  round: number
  season: number
  time: string
}

export interface ConstructorsApiProps {
  constructorId: string
  name: string
  nationality: string
  url: string
}

export interface DriversApiProps {
  code: string
  dateOfBirth: string
  driverId: string
  familyName: string
  givenName: string
}

export interface ResultsApiProps {
  Driver: {
    driverId: string
  }
  position: string
  status: string
}
