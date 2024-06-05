import { PlayerTopBlock } from "./player-top"

export const PlayerFullBody = () => {
  const size = 100
  const height = (size * 64) / 100

  return (
    <div className="relative">
      <img
        src={"hero/hero_empty_64.png"}
        alt=""
        className="w-fit"
        style={{ height }}
      />
      <PlayerTopBlock top="BASIC" />
    </div>
  )
}
