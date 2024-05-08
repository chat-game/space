import type { IGameObjectPlayer } from "../../../../packages/api-sdk/src"
import { PlayerFullBody } from "./player-full-body"

export const GroupPlayerCard = ({
  player,
}: {
  player: IGameObjectPlayer
}) => {
  return (
    <div className="w-fit min-w-48 h-auto px-4 pt-4 pb-2 text-xl bg-primary text-primary border-primary border-b-4 rounded-2xl">
      <div className="-mt-16 -mb-2">
        <PlayerFullBody player={player} />
      </div>
      <p className="font-bold">{player.userName}</p>
      <p className="text-base text-red-700">❤️ {player.health}</p>
    </div>
  )
}
