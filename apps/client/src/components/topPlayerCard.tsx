import type {
  IGameObjectPlayer,
  PlayerTitle,
} from "../../../../packages/api-sdk/src"
import { PlayerFullBody } from "./player-full-body"

export const TopPlayerCard = ({
  player,
  title,
  points,
}: {
  player: IGameObjectPlayer | undefined
  title: PlayerTitle
  points: string
}) => {
  if (!player) {
    return null
  }

  const borderColor = getBorderColorByType(title.type)

  return (
    <div
      key={player.id}
      className={`relative w-fit min-w-48 h-auto px-4 pt-2 pb-2 text-xl text-primary bg-primary border-primary border-b-[6px] rounded-2xl ${borderColor}`}
    >
      <div className="absolute left-1 -top-7">
        <PlayerFullBody />
      </div>
      <p className="pl-12 font-bold">{player.userName}</p>
      <p className="text-base">
        {title.title}! {points}
      </p>
    </div>
  )
}

function getBorderColorByType(type: PlayerTitle["type"]) {
  if (type === "RICH") {
    return "border-teal-4"
  }
  if (type === "FAMOUS") {
    return "border-blue-4"
  }
  if (type === "VIEWER") {
    return "border-violet-4"
  }
  if (type === "RAIDER") {
    return "border-coal-3"
  }
  if (type === "VILLAIN") {
    return "border-red-4"
  }
  if (type === "REFUELLER") {
    return "border-coal-4"
  }
  if (type === "WOODSMAN") {
    return "border-green-4"
  }
  if (type === "MINER") {
    return "border-silver-4"
  }
}
