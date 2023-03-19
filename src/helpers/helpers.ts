import { DriversDbProps } from '../interfaces'

export const formatRaceDateTime = (date: string, time: string) => {
  return new Date(`${date} ${time}`).toLocaleString()
}

export const driverName = (
  driver: DriversDbProps | undefined,
  alt: string = ''
) => {
  if (!driver) return alt
  return `${driver.given_name} ${driver.last_name}`
}
