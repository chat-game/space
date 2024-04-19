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
    return "bg-brown-5 text-brown-1 border-brown-1";
  }
  if (type === "FAMOUS") {
    return "bg-blue-5 text-blue-1 border-blue-1";
  }
  if (type === "VIEWER") {
    return "bg-violet-5 text-violet-1 border-violet-1";
  }
  if (type === "WOODSMAN") {
    return "bg-green-5 text-green-1 border-green-1";
  }
  if (type === "MINER") {
    return "bg-silver-4 text-silver-1 border-silver-1";
  }
}
