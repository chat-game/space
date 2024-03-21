import { usePlayers } from "../hooks/usePlayers.ts";
import { useTrees } from "../hooks/useTrees.ts";
import { Background } from "./background.tsx";
import { PlayerBlock } from "./player.tsx";
import { Stone } from "./stone.tsx";
import { TopBlock } from "./top.tsx";
import { TreeBlock } from "./tree.tsx";
import { Village } from "./village.tsx";

export const Interface = () => {
  const players = usePlayers();
  const trees = useTrees();

  const showPlayers = players.map((player) => (
    <PlayerBlock key={player.id} player={player} />
  ));

  const showTrees = trees?.map((tree) => (
    <TreeBlock key={tree.id} tree={tree} />
  ));

  return (
    <>
      <Background />

      <div className="z-10 absolute top-0 left-0">
        {showPlayers}
        {showTrees}

        <Stone />
        <Village />

        <div className="fixed top-4 left-4" style={{ zIndex: 1000 }}>
          <div className="w-64 h-auto px-4 py-4 text-amber-900 bg-amber-300/90 border-b-4 rounded-2xl">
            <p className="font-semibold">Доступные команды:</p>
            <p className="font-bold text-2xl">!рубить</p>
            <p className="font-bold text-2xl">!дар</p>

            <p className="mt-4 font-semibold">В разработке:</p>
            <p className="font-bold text-2xl">!продать</p>
          </div>
        </div>

        <TopBlock />
      </div>
    </>
  );
};
