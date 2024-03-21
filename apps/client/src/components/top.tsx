import { useTopPlayers } from "../hooks/useTopPlayers.ts";

export const TopBlock = () => {
  const players = useTopPlayers();

  const showTopPlayers = players?.map((player) => {
    return (
      <div
        key={player.id}
        className="w-fit h-auto px-4 py-4 text-xl bg-amber-100/90 text-amber-900 border-b-4 rounded-2xl"
      >
        <p className="font-bold">{player.userName}</p>
        <p>{player.reputation} реп</p>
      </div>
    );
  });

  return (
    <div className="fixed bottom-4 left-4">
      <div className="mb-2 w-fit px-3 py-1 font-semibold text-xl text-amber-900 bg-amber-100/90 border-b-4 rounded-2xl">
        Топ поддержавших деревню:
      </div>
      <div className="flex flex-nowrap gap-2">{showTopPlayers}</div>
    </div>
  );
};
