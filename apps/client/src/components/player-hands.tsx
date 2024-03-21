import type { Player } from "packages/api-sdk/src";

export const PlayerHandsBlock = ({ player }: { player: Player }) => {
  if (!player.handsItemAmount) {
    return null;
  }

  return (
    <div className="absolute top-4 -left-1">
      <div className="w-8">
        <ResourceIcon type={player.handsItemType} />
      </div>
      <div className="absolute top-3.5 left-2 text-center text-amber-100 text-sm font-semibold">
        {player.handsItemAmount}
      </div>
    </div>
  );
};

const ResourceIcon = ({ type }: { type: Player["handsItemType"] }) => {
  if (type === "WOOD") {
    return <img src={"wood/wood1_64.png"} alt="" />;
  }
};
