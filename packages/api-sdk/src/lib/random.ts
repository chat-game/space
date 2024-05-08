export function getRandomInRange(min: number, max: number) {
  const ceilMin = Math.ceil(min)
  return Math.floor(Math.random() * (max - ceilMin + 1)) + ceilMin
}
