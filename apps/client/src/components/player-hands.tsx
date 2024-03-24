import type { InventoryItem, Player } from "packages/api-sdk/src";

export const PlayerHandsBlock = ({
  item,
  isVisible,
}: { item: InventoryItem; isVisible: boolean }) => {
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

const ResourceIcon = ({ type }: { type: Player["handsItemType"] }) => {
  if (type === "WOOD") {
    return <img src={"wood/wood1_64.png"} alt="" />;
  }
};
