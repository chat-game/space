export function ruWordWithEndings(
  int: number,
  array: [string, string, string],
) {
  return array[
    int % 100 > 4 && int % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]
  ]
}
