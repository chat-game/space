import type {
  IGameObjectPlayer,
  ItemType,
} from "../../../../packages/api-sdk/src"
import { ItemImage } from "./itemImage.tsx"
import { PlayerFullBody } from "./player-full-body"

export const GroupPlayerCard = ({
  player,
}: {
  player: IGameObjectPlayer
}) => {
  const wood = player.inventory.items.find(
    (item) => item.type === "WOOD",
  )?.amount
  const stone = player.inventory.items.find(
    (item) => item.type === "STONE",
  )?.amount
  const coin = player.coins

  return (
    <div className="w-full h-auto px-4 py-2 bg-primary text-primary border-primary border-b-4 rounded-2xl">
      <div className="flex flex-row gap-1 items-center">
        <div>
          <PlayerFullBody player={player} />
        </div>
        <div>
          <p className="text-xl font-bold">{player.userName}</p>
          <div className="flex flex-row gap-3">
            <PlayerItem type={"COIN"} amount={coin} />
            <PlayerItem type={"WOOD"} amount={wood} />
            <PlayerItem type={"STONE"} amount={stone} />
          </div>
        </div>
      </div>
    </div>
  )
}

const PlayerItem = ({
  type,
  amount,
}: {
  type: ItemType
  amount: number | undefined
}) => {
  if (!amount) {
    return null
  }

  return (
    <div className="flex flex-row gap-1 items-center">
      <ItemImage type={type} />
      <p className="">{amount}</p>
    </div>
  )
}
