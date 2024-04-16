import { Howl } from "howler";
import { useEffect, useMemo } from "react";
import type { IGameObjectPlayer } from "../../../../packages/api-sdk/src";

export const ToolBlock = ({
  object,
}: {
  object: IGameObjectPlayer;
}) => {
  const axe = object.inventory?.items.find((item) => item.type === "AXE");
  const pickaxe = object.inventory?.items.find(
    (item) => item.type === "PICKAXE",
  );

  const soundChopping = useMemo(
    () =>
      new Howl({
        src: ["/sound/chopping1.wav"],
        loop: true,
        volume: 0.3,
      }),
    [],
  );

  const soundPunch = useMemo(
    () =>
      new Howl({
        src: ["/sound/punch1.wav"],
        loop: true,
        volume: 0.2,
        rate: 0.5,
      }),
    [],
  );

  const soundMining = useMemo(
    () =>
      new Howl({
        src: ["/sound/mining1.wav"],
        loop: true,
        volume: 0.4,
        rate: 0.7,
      }),
    [],
  );

  const isChoppingWithAxe = object.state === "CHOPPING" && !!axe;
  const isMiningWithPickaxe = object.state === "MINING" && !!pickaxe;

  useEffect(() => {
    if (object.state === "CHOPPING") {
      if (isChoppingWithAxe) {
        soundPunch.stop();
        soundChopping.play();
      } else {
        soundChopping.stop();
        soundPunch.play();
      }
      return;
    }

    if (object.state === "MINING") {
      if (isMiningWithPickaxe) {
        soundPunch.stop();
        soundMining.play();
      } else {
        soundMining.stop();
        soundPunch.play();
      }
      return;
    }

    soundChopping.stop();
    soundMining.stop();
    soundPunch.stop();

    return () => {
      soundChopping.stop();
      soundMining.stop();
      soundPunch.stop();
    };
  }, [
    object.state,
    isChoppingWithAxe,
    isMiningWithPickaxe,
    soundChopping,
    soundMining,
    soundPunch,
  ]);

  return (
    <>
      {axe && object.state === "CHOPPING" && (
        <img
          src={"tools/axe1_64.png"}
          alt=""
          className="absolute animation-tree-chopping"
          style={{ top: 0, left: 8 }}
        />
      )}

      {pickaxe && object.state === "MINING" && (
        <img
          src={"tools/pickaxe1_64.png"}
          alt=""
          className="absolute animation-tree-chopping"
          style={{ top: 0, left: 8 }}
        />
      )}
    </>
  );
};
