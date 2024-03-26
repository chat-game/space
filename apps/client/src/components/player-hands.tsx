import type { InventoryItem, ItemType } from "packages/api-sdk/src";

export const PlayerHandsBlock = ({
  item,
  isVisible,
}: {
  item: InventoryItem | null;
  isVisible: boolean;
}) => {
  if (!item || !item.amount || item.amount === 0) {
    return null;
  }

  return (
    <div className={`absolute top-4 -left-1 ${!isVisible && "hidden"}`}>
      <div className="w-8">
        <ResourceIcon type={item.type} />
      </div>
      <div className="absolute top-3.5 left-2 text-center text-amber-100 text-sm font-semibold">
        {item.amount}
      </div>
    </div>
  );
};

const ResourceIcon = ({ type }: { type: ItemType }) => {
  if (type === "WOOD") {
    return <img src={"wood/wood1_64.png"} alt="" />;
  }
  if (type === "STONE") {
    return <img src={"stone/stone_res1_64.png"} alt="" />;
  }
};
