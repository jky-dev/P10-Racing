export const formatRaceDateTime = (date: string, time: string) => {
  return new Date(`${date} ${time}`).toLocaleString()
}
