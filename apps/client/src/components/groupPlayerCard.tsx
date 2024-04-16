import type { Player } from "../../../../packages/api-sdk/src";
import { PlayerFullBody } from "./player-full-body";

export const GroupPlayerCard = ({
  player,
}: {
  player: Player | null | undefined;
}) => {
  if (!player) {
    return null;
  }

  return (
    <div
      key={player.id}
      className="w-fit min-w-48 h-auto px-4 pt-4 pb-2 text-xl text-amber-900 bg-amber-100 border-b-4 rounded-2xl"
    >
      <div className="-mt-16 -mb-2">
        <PlayerFullBody player={player} />
      </div>
      <p className="font-bold">{player.userName}</p>
      <p className="text-base font-semibold text-red-700">❤️ {player.health}</p>
    </div>
  );
};
