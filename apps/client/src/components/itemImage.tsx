import type { IGameInventoryItem } from "../../../../packages/api-sdk/src"
import coinImage from "../game/assets/images/icons/items/coin.png"
import stoneImage from "../game/assets/images/icons/items/stone.png"
import woodImage from "../game/assets/images/icons/items/wood.png"

export function ItemImage({ type }: { type: IGameInventoryItem["type"] }) {
  if (type === "WOOD") {
    return <img src={woodImage} width={28} height={28} alt="" />
  }
  if (type === "STONE") {
    return <img src={stoneImage} width={28} height={28} alt="" />
  }
  if (type === "COIN") {
    return <img src={coinImage} width={28} height={28} alt="" />
  }
}
