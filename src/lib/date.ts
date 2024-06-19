export function getDatePlusMinutes(minutes: number): Date {
  const milliseconds = minutes * 60 * 1000
  return new Date(new Date().getTime() + milliseconds)
}

export function getDateMinusMinutes(minutes: number): Date {
  const milliseconds = minutes * 60 * 1000
  return new Date(new Date().getTime() - milliseconds)
}

export function getDatePlusSeconds(seconds: number): Date {
  const milliseconds = seconds * 1000
  return new Date(new Date().getTime() + milliseconds)
}
