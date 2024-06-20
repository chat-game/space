export function pluralizationRu(int: number, array: [string, string, string]): string {
  const i = Math.abs(int)

  return array[
    i % 100 > 4 && i % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][i % 10 < 5 ? i % 10 : 5]
  ]
}
