import { useMediaQuery } from '@mui/material'
import { format } from 'date-fns'

import { DriversDbProps } from '../interfaces'

export const formatRaceDateTime = (
  date: string,
  time: string,
  isMobile: boolean,
  dateObject?: Date
) => {
  const longFormat = 'eeee, do MMMM - hh:mmaaa'
  const shortFormat = 'eee, do MMM - hh:mmaaa'
  const stringFormat = isMobile ? shortFormat : longFormat

  if (dateObject) {
    return format(dateObject, stringFormat)
  }
  return format(new Date(`${date} ${time}`), stringFormat)
}

export const driverName = (
  driver: DriversDbProps | undefined,
  isMobile: boolean,
  alt: string = '',
  keepLong: boolean = false
) => {
  if (!driver) return alt
  if (keepLong) {
    return `${driver.given_name} ${driver.last_name}`
  }
  if (isMobile) {
    return `${driver.given_name.charAt(0)}. ${driver.last_name}`
  } else {
    return `${driver.given_name} ${driver.last_name}`
  }
}
