import { useTopPlayers } from "../hooks/useTopPlayers.ts";
import { PlayerFullBody } from "./player-full-body.tsx";

export const TopBlock = () => {
  const players = useTopPlayers();

  const showTopPlayers = players?.map((player) => {
    return (
      <div
        key={player.id}
        className="w-fit h-auto px-4 py-4 text-xl bg-blue-100/90 text-blue-800 border-b-4 rounded-2xl"
      >
        <div className="-mt-16 -mb-2">
          <PlayerFullBody player={player} />
        </div>
        <p className="font-bold">{player.userName}</p>
        <p className="text-sm text-blue-700 font-semibold">
          {player.reputation} реп.
        </p>
      </div>
    );
  });

  return (
    <div className="-z-50 fixed bottom-4 left-4">
      <div className="flex flex-row flex-wrap gap-4 items-end">
        <div className="w-48 px-3 py-2 font-semibold text-xl tracking-tight leading-tight text-amber-900 bg-amber-100/90 border-b-4 rounded-2xl">
          Топ поддержавших деревню
        </div>
        <div className="h-fit flex flex-nowrap gap-2">{showTopPlayers}</div>
      </div>
    </div>
  );
};
