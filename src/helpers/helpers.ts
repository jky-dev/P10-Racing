import { DriversDbProps } from '../interfaces'

export const formatRaceDateTime = (date: string, time: string) => {
  return new Date(`${date} ${time}`).toLocaleString()
}

export const driverName = (
  driver: DriversDbProps | undefined,
  alt: string = ''
) => {
  if (!driver) return alt
  const width = window.matchMedia('(max-width:600px)')
  if (width.matches) {
    return `${driver.given_name.charAt(0)}. ${driver.last_name}`
  } else {
    return `${driver.given_name} ${driver.last_name}`
  }
}
