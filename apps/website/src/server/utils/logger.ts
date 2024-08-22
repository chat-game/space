export function log(...args: string[]) {
  console.log(
    `[${new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'UTC',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })}]`,
    ...args
  )
}
