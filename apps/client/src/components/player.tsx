import type { Player } from "../../../../packages/api-sdk/src";
import { PlayerHandsBlock } from "./player-hands.tsx";
import { PlayerTopBlock } from "./player-top.tsx";
import { ToolBlock } from "./tool.tsx";

export const PlayerBlock = ({ player }: { player: Player }) => {
  const size = 100;
  const height = (size * 64) / 100;

  const showAxe = player.isBusy;

  return (
    <div
      key={player.id}
      className="fixed"
      style={{ zIndex: player.y + height, top: player.y, left: player.x }}
    >
      <div style={{ marginTop: -height + 16, marginLeft: -height / 2 }}>
        <div className="relative">
          <img
            src={"hero/hero_empty_64.png"}
            alt=""
            className="w-fit"
            style={{ height: height }}
          />
          <PlayerTopBlock top="BASIC" colorIndex={player.colorIndex} />
          {showAxe && <ToolBlock tool="AXE" isWorking />}
          <PlayerHandsBlock player={player} />
        </div>

        <div className="-ml-4 w-fit text-center">
          <div className="flex flex-row gap-1 bg-amber-100/90 text-amber-900 rounded-2xl font-semibold text-sm tracking-tight">
            <div className="px-2 py-1.5 bg-blue-200 text-xs text-blue-700 font-bold rounded-2xl">
              {player.reputation}
            </div>
            <div className="pr-2 py-1">{player.userName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
