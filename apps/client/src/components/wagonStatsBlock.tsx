import { IconBrandSpeedtest, IconGasStation } from "@tabler/icons-react"
import type { IGameObjectWagon } from "../../../../packages/api-sdk/src"

export const WagonStatsBlock = ({
  wagon,
}: {
  wagon: IGameObjectWagon | undefined
}) => {
  if (!wagon) {
    return null
  }

  const speedInMeters = wagon.speed
  const fuelInSeconds = Math.round(wagon.fuel / 40)
  const fuelInMinutes = Math.round(fuelInSeconds / 60)

  // speedInMeters > 0 ? `${speedInMeters} м/сек` : "[стоп]"
  const showSpeed = `${speedInMeters} м/сек`
  const showFuelTime =
    fuelInSeconds > 0
      ? fuelInMinutes <= 3
        ? `${fuelInSeconds} сек`
        : `≈ ${fuelInMinutes} мин`
      : "[нет топлива]"

  return (
    <div className="flex flex-row flex-nowrap gap-6 items-center text-primary">
      <div className="flex flex-row flex-nowrap gap-2 font-bold text-center text-lg items-center">
        <IconBrandSpeedtest />
        <p>{showSpeed}</p>
      </div>
      <div className="flex flex-row flex-nowrap gap-2 font-bold text-center text-lg items-center">
        <IconGasStation />
        <p>{showFuelTime}</p>
      </div>
    </div>
  )
}
