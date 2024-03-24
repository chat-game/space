import { useEffect, useState } from "react";
import {
  type Player,
  setPlayerIsOnTarget,
} from "../../../../packages/api-sdk/src";
import { useInventory } from "../hooks/useInventory.ts";
import { PlayerHandsBlock } from "./player-hands.tsx";
import { PlayerSkillBlock } from "./player-skill.tsx";
import { PlayerTopBlock } from "./player-top.tsx";
import { ToolBlock } from "./tool.tsx";

export const PlayerBlock = ({ player }: { player: Player }) => {
  const items = useInventory(player.id);
  const itemsWood = items[0] ?? null;

  const size = 100;
  const height = (size * 64) / 100;

  const [y, setY] = useState(player.y);
  const [x, setX] = useState(player.x);

  const needToMove = !!player.targetId;
  const needToMoveY = needToMove && y !== player.targetY;
  const needToMoveX = needToMove && x !== player.targetX;

  useEffect(() => {
    // Run to target
    const repeatY = setInterval(() => {
      if (player.targetY && y < player.targetY) {
        setY((prevState) => prevState + 1);
      }
      if (player.targetY && y > player.targetY) {
        setY((prevState) => prevState - 1);
      }
    }, 20);

    const repeatX = setInterval(() => {
      if (player.targetX && x < player.targetX) {
        setX((prevState) => prevState + 1);
      }
      if (player.targetX && x > player.targetX) {
        setX((prevState) => prevState - 1);
      }
    }, 20);

    // Is on target now!
    if (needToMove && !needToMoveY && !needToMoveX) {
      // Ok
      setPlayerIsOnTarget(player.id).then(() => {
        clearInterval(repeatY);
        clearInterval(repeatX);
      });
    }

    return () => {
      clearInterval(repeatY);
      clearInterval(repeatX);
    };
  }, [
    x,
    y,
    player.id,
    player.targetX,
    player.targetY,
    needToMove,
    needToMoveX,
    needToMoveY,
  ]);

  const isChopping = player.isBusy && !needToMove;

  const [handVisibleSeconds, setHandVisibleSeconds] = useState(0);

  useEffect(() => {
    isChopping && setHandVisibleSeconds(50);

    const timer = setInterval(() => {
      setHandVisibleSeconds((prevState) => (prevState > 0 ? prevState - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isChopping]);

  return (
    <div className="fixed" style={{ zIndex: y + height, top: y, left: x }}>
      <div style={{ marginTop: -height + 16, marginLeft: -height / 2 }}>
        <div className="relative">
          <img
            src={"hero/hero_empty_64.png"}
            alt=""
            className="w-fit"
            style={{ height: height }}
          />
          <PlayerTopBlock top="BASIC" colorIndex={player.colorIndex} />
          {isChopping && <ToolBlock tool="AXE" isWorking />}
          <PlayerHandsBlock
            item={itemsWood}
            isVisible={handVisibleSeconds > 0}
          />
        </div>

        <div className="absolute -top-14 left-10">
          <PlayerSkillBlock
            playerId={player.id}
            isGrowing={isChopping}
            skill={player.skillWood}
            skillLvl={player.skillWoodLvl}
            skillNextLvl={player.skillWoodNextLvl}
          />
        </div>

        <div className="w-fit text-center">
          <div className="px-2 py-0.5 bg-amber-100/90 text-amber-900 rounded-2xl font-semibold text-xs tracking-tight">
            {player.userName}
          </div>
          <div className="-mt-0.5 flex flex-row gap-1 justify-center tracking-tight">
            {player?.reputation > 0 && (
              <div className="px-2 py-1.5 bg-blue-200 text-xs text-blue-700 border-t-2 font-bold rounded-lg">
                {player.reputation}
              </div>
            )}
            {player?.coins > 0 && (
              <div className="px-2 py-1.5 bg-yellow-200 text-xs text-yellow-600 border-t-2 font-bold rounded-full">
                {player.coins}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
