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

  if (dateObject && !isNaN(dateObject?.getTime())) {
    // check valid date object
    return format(dateObject, stringFormat)
  } else if (date && time) {
    return format(new Date(`${date} ${time}`), stringFormat)
  } else {
    return 'Unknown'
  }
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

export const navItemToPathMap: { [key: string]: string } = {
  'P10 Racing': '',
  Results: 'results',
  Leagues: 'leagues',
  Profile: 'profile',
  Admin: 'admin',
  Login: 'login',
  About: 'about',
  Qualifying: 'qualifying',
  Schedule: 'schedule',
  FAQs: 'faqs',
  'Contact Us': 'contact',
  'Edit Profile': 'profile',
  Logout: 'logout',
  Standings: 'standings',
}

export const pointsMap: { [key: number]: number } = {
  1: 1,
  2: 2,
  3: 4,
  4: 6,
  5: 8,
  6: 10,
  7: 12,
  8: 15,
  9: 18,
  10: 25,
  11: 18,
  12: 15,
  13: 12,
  14: 10,
  15: 8,
  16: 6,
  17: 4,
  18: 2,
  19: 1,
  20: -5,
}

const timePlural = (time: number, unit: string) => {
  return `${time} ${unit}${time !== 1 ? 's' : ''}`
}

export const timeLeftString = (
  days: number,
  hours: number,
  minutes: number,
  seconds: number
): string => {
  // if greater than 2 days remaining, just return x days
  // if < 2 days, show days + hours
  // if 0 days remaining, show hours + minutes
  // if < 1 hour, show minutes + seconds

  if (days > 1) {
    return `${days} days`
  }

  if (days > 0) {
    return `1 day and ${
      hours > 0
        ? timePlural(hours, 'hour')
        : minutes > 0
        ? timePlural(minutes, 'minute')
        : timePlural(seconds, 'second')
    }`
  }

  if (hours > 0) {
    return `${timePlural(hours, 'hour')} and ${
      minutes > 0
        ? timePlural(minutes, 'minute')
        : timePlural(seconds, 'second')
    }`
  }

  if (minutes > 0) {
    return `${timePlural(minutes, 'minute')} and ${timePlural(
      seconds,
      'second'
    )}`
  }

  return `less than a minute`
}
