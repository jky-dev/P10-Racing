import { DriversDbProps } from '../interfaces'

export const formatRaceDateTime = (date: string, time: string) => {
  return new Date(`${date} ${time}`).toLocaleString()
}

export const driverName = (
  driver: DriversDbProps | undefined,
  alt: string = '',
  keepLong: boolean = false
) => {
  if (!driver) return alt
  if (keepLong) {
    return `${driver.given_name} ${driver.last_name}`
  }
  const width = window.matchMedia('(max-width:600px)')
  if (width.matches) {
    return `${driver.given_name.charAt(0)}. ${driver.last_name}`
  } else {
    return `${driver.given_name} ${driver.last_name}`
  }
}
