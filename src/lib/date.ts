export function getDatePlusMinutes(minutes: number) {
  const milliseconds = minutes * 60 * 1000
  return new Date(new Date().getTime() + milliseconds)
}

export function getDateMinusMinutes(minutes: number) {
  const milliseconds = minutes * 60 * 1000
  return new Date(new Date().getTime() - milliseconds)
}

export function getDatePlusSeconds(seconds: number) {
  const milliseconds = seconds * 1000
  return new Date(new Date().getTime() + milliseconds)
}
