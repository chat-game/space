import { Howl } from "howler";
import { useEffect, useMemo } from "react";
import type { Stone } from "../../../../packages/api-sdk/src";

export const StoneBlock = ({ stone }: { stone: Stone }) => {
  const size = stone.size;
  const height = (size * 128) / 100;

  const isShaking = stone.inProgress;

  const sound = useMemo(
    () =>
      new Howl({
        src: ["/sound/chopping1.wav"],
        loop: true,
      }),
    [],
  );

  useEffect(() => {
    if (isShaking) {
      sound.play();
      return;
    }

    sound.stop();
  }, [isShaking, sound]);

  return (
    <div
      className={`fixed ${
        isShaking ? "animation-tree-shake" : "animation-stone-little-shake"
      }`}
      style={{ zIndex: stone.y, top: stone.y, left: stone.x }}
    >
      <div style={{ marginTop: -height, marginLeft: -height / 2 }}>
        <img
          src={`stone/stone${stone.type}_128.png`}
          alt=""
          className="w-fit"
          style={{ height }}
        />
      </div>
    </div>
  );
};
