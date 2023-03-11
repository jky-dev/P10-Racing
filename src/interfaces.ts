export interface RacesProps {
  date: String
  raceName: String
  round: String
  season: String
  time: String
  url: String
}

export interface RaceResult {
  Constructor: {
    constructorId: String
    name: String
    nationality: String
    url: String
  }
  Driver: {
    code: String
    givenName: String
    familyName: String
    driverId: String
  }
  grid: number
  laps: number
  numberpoints: number
  position: number
  positionText: String
  status: String
}
