import type {
  IGameObjectPlayer,
  PlayerTitle,
} from "../../../../packages/api-sdk/src";
import { PlayerFullBody } from "./player-full-body";

export const TopPlayerCard = ({
  player,
  title,
  points,
}: {
  player: IGameObjectPlayer | undefined;
  title: PlayerTitle;
  points: string;
}) => {
  if (!player) {
    return null;
  }

  const colors = getPlayerCardColors(title.type);

  return (
    <div
      key={player.id}
      className={`w-fit min-w-48 h-auto px-4 pt-4 pb-2 text-xl border-b-4 rounded-2xl ${colors}`}
    >
      <div className="-mt-16 -mb-2">
        <PlayerFullBody player={player} />
      </div>
      <p className="font-bold">{player.userName}</p>
      <p className="text-sm font-semibold">
        {title.title}! {points}
      </p>
    </div>
  );
};

function getPlayerCardColors(type: PlayerTitle["type"]) {
  if (type === "RICH") {
    return "bg-yellow-100 text-yellow-600 border-yellow-500";
  }
  if (type === "FAMOUS") {
    return "bg-blue-100 text-blue-800 border-blue-800";
  }
  if (type === "VIEWER") {
    return "bg-violet-100 text-violet-700 border-violet-800";
  }
  if (type === "WOODSMAN") {
    return "bg-green-200 text-green-800 border-green-700";
  }
  if (type === "MINER") {
    return "bg-zinc-200 text-zinc-700 border-zinc-600";
  }
}
