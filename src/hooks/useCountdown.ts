import { useEffect, useState } from 'react'

const useCountdown = (date: Date) => {
  const timeUntilDate = date.valueOf() - Date.now()
  const [time, setTimer] = useState(timeUntilDate)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1000)
    }, 1000)

    return () => clearInterval(interval)
  }, [time])

  const DAYS_IN_MS = 1000 * 60 * 60 * 24
  const HOURS_IN_MS = 1000 * 60 * 60
  const MIN_IN_MS = 1000 * 60
  const SEC_IN_MS = 1000

  let diff = time
  const days = Math.floor(diff / DAYS_IN_MS) // Give the remaining days
  diff -= days * DAYS_IN_MS // Subtract passed days
  const hours = Math.floor(diff / HOURS_IN_MS) // Give remaining hours
  diff -= hours * HOURS_IN_MS // Subtract hours
  const minutes = Math.floor(diff / MIN_IN_MS) // Give remaining minutes
  diff -= minutes * MIN_IN_MS // Subtract minutes
  const seconds = Math.floor(diff / SEC_IN_MS) // Give remaining seconds
  return {
    days: days, // Format everything into the return type
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  }
}

export default useCountdown
