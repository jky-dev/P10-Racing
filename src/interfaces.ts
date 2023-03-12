export interface RacesProps {
  date: string
  raceName: string
  round: string
  season: string
  time: string
  url: string
}

export interface RaceResult {
  Constructor: {
    constructorId: string
    name: string
    nationality: string
    url: string
  }
  Driver: {
    code: string
    givenName: string
    familyName: string
    driverId: string
  }
  grid: number
  laps: number
  numberpoints: number
  position: number
  positionText: string
  status: string
}

export interface User {
  email: string
  username: string
}

interface LeagueUser {
  id: string
  name: string
}

export interface League {
  members: LeagueUser[]
  name: string
}
