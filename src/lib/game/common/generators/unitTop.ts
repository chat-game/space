import type { IGameObjectUnit } from "$lib/game/types"

export const generateUnitTop = (): Partial<
  IGameObjectUnit["visual"]["top"]
> => {
  const availableTopsForUnits: IGameObjectUnit["visual"]["top"][] = [
    "GREEN_SHIRT",
    "BLUE_SHIRT",
    "DARK_SILVER_SHIRT",
  ]

  return availableTopsForUnits[
    Math.floor(Math.random() * availableTopsForUnits.length)
  ]
}
