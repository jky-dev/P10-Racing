import { Drivers } from '../mocks/Drivers'
import { driverName, formatRaceDateTime, timeLeftString } from './helpers'

describe('Helper', () => {
  describe('Time Left String', () => {
    describe('Has days left', () => {
      it('should return the correct string when greater than two days left', () => {
        expect(timeLeftString(2, 0, 0, 0)).toBe('2 days')
      })

      it('should return the correct string with a day and many hours', () => {
        expect(timeLeftString(1, 23, 59, 59)).toBe('1 day and 23 hours')
      })

      it('should return the correct string with a day and a hours', () => {
        expect(timeLeftString(1, 1, 59, 59)).toBe('1 day and 1 hour')
      })

      it('should return the correct string with a day and 0 hours', () => {
        expect(timeLeftString(1, 0, 59, 59)).toBe('1 day and 59 minutes')
      })

      it('should return the correct string with a day and 1 minute', () => {
        expect(timeLeftString(1, 0, 1, 59)).toBe('1 day and 1 minute')
      })

      it('should return the correct string with a day and 0 minutes', () => {
        expect(timeLeftString(1, 0, 0, 59)).toBe('1 day and 59 seconds')
      })

      it('should return the correct string with a day and 1 second', () => {
        expect(timeLeftString(1, 0, 0, 1)).toBe('1 day and 1 second')
      })

      it('should return the correct string with a day and 0 seconds', () => {
        expect(timeLeftString(1, 0, 0, 0)).toBe('1 day and 0 seconds')
      })
    })
    describe('has hours left', () => {
      it('should return the correct string with many hours and minutes', () => {
        expect(timeLeftString(0, 23, 59, 59)).toBe('23 hours and 59 minutes')
      })

      it('should return the correct string with many hours and 1 minute', () => {
        expect(timeLeftString(0, 23, 1, 59)).toBe('23 hours and 1 minute')
      })

      it('should return the correct string with many hours and no minutes', () => {
        expect(timeLeftString(0, 23, 0, 59)).toBe('23 hours and 59 seconds')
      })

      it('should return the correct string with many hours and one second', () => {
        expect(timeLeftString(0, 23, 0, 1)).toBe('23 hours and 1 second')
      })

      it('should return the correct string with many hours and zero seconds', () => {
        expect(timeLeftString(0, 23, 0, 0)).toBe('23 hours and 0 seconds')
      })

      it('should return the correct string with one hour and zero seconds', () => {
        expect(timeLeftString(0, 1, 0, 0)).toBe('1 hour and 0 seconds')
      })
    })
    describe('has minutes left', () => {
      it('should return the correct string with many minutes and seconds', () => {
        expect(timeLeftString(0, 0, 30, 59)).toBe('30 minutes and 59 seconds')
      })

      it('should return the correct string with many minutes and no seconds', () => {
        expect(timeLeftString(0, 0, 30, 0)).toBe('30 minutes and 0 seconds')
      })

      it('should return the correct string with one minute and one second', () => {
        expect(timeLeftString(0, 0, 1, 1)).toBe('1 minute and 1 second')
      })

      it('should return the correct string with one minute and 0 seconds', () => {
        expect(timeLeftString(0, 0, 1, 0)).toBe('1 minute and 0 seconds')
      })
    })

    describe('has seconds left', () => {
      it('should return the correct string with 59 seconds', () => {
        expect(timeLeftString(0, 0, 0, 59)).toBe('less than a minute')
      })

      it('should return the correct string with 0 seconds', () => {
        expect(timeLeftString(0, 0, 0, 0)).toBe('less than a minute')
      })
    })
  })

  describe('Format Race Date Time', () => {
    const date = '2023-03-31'
    const time = '06:00:00Z'
    const dateObject = new Date(date + ' ' + time)

    it('should format with valid date object', () => {
      expect(formatRaceDateTime(date, time, false, dateObject)).toBe(
        'Friday, 31st March - 06:00am'
      )
    })

    it('should format with valid date object for mobile', () => {
      expect(formatRaceDateTime(date, time, true, dateObject)).toBe(
        'Fri, 31st Mar - 06:00am'
      )
    })

    it('should format with undefined date object for mobile', () => {
      expect(formatRaceDateTime(date, time, true, new Date(undefined))).toBe(
        'Fri, 31st Mar - 06:00am'
      )
    })

    it('should return unknown if nothing provided', () => {
      expect(formatRaceDateTime(null, null, true, new Date(undefined))).toBe(
        'Unknown'
      )
    })
  })

  describe('Driver name', () => {
    const driver = Drivers[0]
    it('should return the alternative if no driver provided', () => {
      expect(driverName(undefined, false, '-')).toBe('-')
    })

    it('should return the full driver name even on mobile', () => {
      expect(driverName(driver, true, '-', true)).toBe('Esteban Ocon')
    })

    it('should return the full driver name', () => {
      expect(driverName(driver, false, '-')).toBe('Esteban Ocon')
    })

    it('should return the shortened driver name', () => {
      expect(driverName(driver, true, '-')).toBe('E. Ocon')
    })
  })
})
