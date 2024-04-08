import { useTopCoinsPlayers } from "../hooks/useTopCoinsPlayer.ts";
import { useTopPlayers } from "../hooks/useTopPlayers";
import { PlayerFullBody } from "./player-full-body";

export const TopBlock = () => {
  const players = useTopPlayers();
  const richPlayers = useTopCoinsPlayers();

  const showRichPlayers = richPlayers?.slice(0, 1).map((player) => {
    return (
      <div
        key={player.id}
        className="w-fit min-w-44 h-auto px-4 pt-4 pb-2 text-xl bg-yellow-200 text-yellow-600 border-b-4 border-yellow-500 rounded-2xl"
      >
        <div className="-mt-16 -mb-2">
          <PlayerFullBody player={player} />
        </div>
        <p className="font-bold">{player.userName}</p>
        <p className="text-sm font-semibold">Богач! {player.coins} монет</p>
      </div>
    );
  });

  const showTopPlayers = players?.map((player, index) => {
    return (
      <div
        key={player.id}
        className="w-fit min-w-44 h-auto px-4 pt-4 pb-2 text-xl bg-blue-100/90 text-blue-800 border-b-4 rounded-2xl"
      >
        <div className="-mt-16 -mb-2">
          <PlayerFullBody player={player} />
        </div>
        <p className="font-bold">{player.userName}</p>
        <p className="text-sm text-blue-700 font-semibold">
          {index === 0 && "Филантроп!"} {player.reputation} реп.
        </p>
      </div>
    );
  });

  return (
    <div className="-z-50 fixed bottom-4 left-4">
      <div className="flex flex-row flex-nowrap gap-2 items-end">
        <div className="w-fit px-3 py-2 font-bold text-xl tracking-tight leading-5 text-amber-900 bg-amber-100/90 border-b-4 rounded-2xl">
          Топ игроков
        </div>
        <div className="h-fit flex flex-nowrap gap-2">
          {showRichPlayers}
          {showTopPlayers}
        </div>
      </div>
    </div>
  );
};
