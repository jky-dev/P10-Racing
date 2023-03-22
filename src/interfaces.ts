export interface LeaguesProps {
  created_at: string | null
  created_by_uuid: string
  id: number
  invite_code: string
  name: string
}

export interface F1RaceApiProps {
  Circuit: {
    circuitId: string
    circuitName: string
  }
  FirstPractice: {
    date: string
    time: string
  }
  Qualifying: {
    date: string
    time: string
  }
  SecondPractice: {
    date: string
    time: string
  }
  ThirdPractice?: {
    date: string
    time: string
  }
  Sprint?: {
    date: string
    time: string
  }
  date: string
  raceName: string
  round: number
  season: number
  time: string
}

export interface F1ConstructorsApiProps {
  constructorId: string
  name: string
  nationality: string
  url: string
}

export interface F1DriversApiProps {
  code: string
  dateOfBirth: string
  driverId: string
  familyName: string
  givenName: string
}

export interface F1ResultsApiProps {
  Driver: {
    driverId: string
  }
  position: string
  status: string
}

export interface LeagueResultsDbProps {
  created_at: string
  id: number
  driver_id: number | null
  index: string
  race_id: number
  league_id: number
  leagues: {
    name: string
    invite_code: string
  }
  points_gained: number
  races: RacesDbProps
  user_uuid: string
  users: UserDbProps
}

export interface LeagueMembersDbProps {
  created_at: string
  id: number
  index: string
  league_id: number
  user_uuid: string
  users: UserDbProps
}

export interface RacesDbProps {
  created_at: string
  date: string
  id: number
  race_name: string
  round_number: number
  time: string
  year: number
  fp1_date: string
  fp1_time: string
  fp2_date: string
  fp2_time: string
  fp3_date: string
  fp3_time: string
  sprint_date: string
  sprint_time: string
  quali_date: string
  quali_time: string
}

export interface RaceResultsDbProps {
  created_at: string
  driver_id: string
  id: number
  position: number
  race_id: number
  status: string
  unique_index: string
}

export interface RacesWithResultsDbProps extends RacesDbProps {
  race_results: RaceResultsDbProps[]
}

export interface DriversDbProps {
  id: number
  constructor: string
  driver_id: string
  given_name: string
  last_name: string
}

export interface UserDbProps {
  created_at: string
  email: string
  name: string
  uuid: string
}

export interface InviteCodeDbProps {
  invite_code: string
  created_at: string
  league_id: number
}

export interface LeagueDbProps {
  id: number
  created_at: string
  name: string
  invite_code: string
  created_by_uuid: string
}
