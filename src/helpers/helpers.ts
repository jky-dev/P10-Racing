import { DriversDbProps } from '../interfaces'

export const formatRaceDateTime = (date: string, time: string) => {
  return new Date(`${date} ${time}`).toLocaleString()
}

export const driverName = (driver: DriversDbProps) => {
  return `${driver.given_name} ${driver.last_name}`
}
