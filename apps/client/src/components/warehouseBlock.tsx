import { IconBuildingWarehouse } from "@tabler/icons-react"
import type { IGameInventoryItem } from "../../../../packages/api-sdk/src"
import { ItemImage } from "./itemImage.tsx"

export const WarehouseBlock = ({
  items,
}: {
  items: IGameInventoryItem[] | undefined
}) => {
  if (!items) {
    return null
  }

  const showItems = items?.map((item) => <Item key={item.id} item={item} />)

  return (
    <div className="flex flex-row gap-3 items-center text-primary">
      <div className="flex flex-row gap-2 items-center">
        <IconBuildingWarehouse />
        <p>На складе</p>
      </div>

      <div className="flex flex-row gap-2 items-center">{showItems}</div>
    </div>
  )
}

const Item = ({ item }: { item: IGameInventoryItem }) => {
  return (
    <div className="flex flex-row gap-1 items-center">
      <ItemImage type={item.type} /> <p className="text-lg">{item.amount}</p>
    </div>
  )
}
