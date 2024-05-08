import type { IGameObjectPlayer } from "packages/api-sdk/src"
import { PlayerTopBlock } from "./player-top"

export const PlayerFullBody = ({ player }: { player: IGameObjectPlayer }) => {
  const size = 100
  const height = (size * 64) / 100

  return (
    <div className="relative">
      <img
        src={"hero/hero_empty_64.png"}
        alt=""
        className="w-fit"
        style={{ height: height }}
      />
      <PlayerTopBlock top="BASIC" colorIndex={0} />
    </div>
  )
}
