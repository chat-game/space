import { usePlayers } from "../hooks/usePlayers.ts";
import { useStones } from "../hooks/useStones.ts";
import { useTrees } from "../hooks/useTrees.ts";
import { Background } from "./background.tsx";
import { DealerBlock } from "./dealer.tsx";
import { PlayerBlock } from "./player.tsx";
import { RabbitBlock } from "./rabbit.tsx";
import { StoneBlock } from "./stone.tsx";
import { TopBlock } from "./top.tsx";
import { TreeBlock } from "./tree.tsx";
import { Village } from "./village.tsx";
import { WolfBlock } from "./wolf.tsx";

export const Interface = () => {
  const players = usePlayers();
  const trees = useTrees();
  const stones = useStones();

  const showPlayers = players.map((player) => (
    <PlayerBlock key={player.id} player={player} />
  ));

  const showTrees = trees?.map((tree) => (
    <TreeBlock key={tree.id} tree={tree} />
  ));

  const showStones = stones?.map((stone) => (
    <StoneBlock key={stone.id} stone={stone} />
  ));

  return (
    <>
      <Background />

      <div className="z-10 absolute top-0 left-0">
        {showPlayers}
        {showTrees}
        {showStones}

        <Village />

        <RabbitBlock start={{ x: 200, y: 250 }} />
        <RabbitBlock start={{ x: 800, y: 750 }} />
        <RabbitBlock start={{ x: 1200, y: 1100 }} />

        <WolfBlock start={{ x: 400, y: 450 }} />

        <DealerBlock dealer={{ x: 630, y: 680 }} />

        <div className="fixed top-4 left-4" style={{ zIndex: 1000 }}>
          <div className="w-72 h-auto px-4 py-4 text-amber-900 bg-amber-100/90 border-b-4 rounded-2xl">
            <p className="hidden font-bold text-xl tracking-tight leading-tight">
              Пиши команды в чат
            </p>

            <p className="font-semibold">Пиши команды в чат:</p>
            <p className="font-bold text-2xl">!рубить</p>
            <p className="font-bold text-2xl">!подарить древесину</p>
            <p className="font-bold text-2xl">!продать [что?]</p>

            <p className="hidden mt-4 font-semibold">В разработке:</p>
          </div>
        </div>

        <TopBlock />
      </div>
    </>
  );
};
