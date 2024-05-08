import type { IGameObjectWagon } from "../../../../packages/api-sdk/src"
import fuel1 from "../game/assets/images/icons/fuel-1.png"
import speed1 from "../game/assets/images/icons/speed-1.png"

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

  const showSpeed = speedInMeters > 0 ? `${speedInMeters} м/сек` : "[стоп]"
  const showFuelTime =
    fuelInSeconds > 0
      ? fuelInMinutes <= 3
        ? `${fuelInSeconds} сек`
        : `≈ ${fuelInMinutes} мин`
      : "[нет топлива]"

  return (
    <div className="mt-2 flex flex-row flex-nowrap gap-2 justify-center items-center bg-primary text-primary border-primary border-b-4 rounded-2xl">
      <div className="min-w-28 px-3 py-2 font-bold text-center text-lg items-center">
        <img src={speed1} alt="" width={32} height={32} className="mx-auto" />
        <p>{showSpeed}</p>
      </div>
      <div className="min-w-28 px-3 py-2 font-bold text-center text-lg items-center">
        <img src={fuel1} alt="" width={32} height={32} className="mx-auto" />
        <p>{showFuelTime}</p>
      </div>
    </div>
  )
}
