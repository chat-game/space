import { Howl } from "howler";
import { useEffect, useMemo } from "react";
import type { Tree } from "../../../../packages/api-sdk/src";

export const TreeBlock = ({ tree }: { tree: Tree }) => {
  const type = tree.type;
  const size = tree.size;
  const height = (size * 128) / 100;

  const isShaking = tree.inProgress;

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
      className={`fixed ${isShaking && "animation-tree-shake"}`}
      style={{ zIndex: tree.y, top: tree.y, left: tree.x }}
    >
      <div style={{ marginTop: -height, marginLeft: -height / 2 }}>
        <img
          src={`tree/tree${type}_128.png`}
          alt=""
          className="w-fit"
          style={{ height: height }}
        />
      </div>
    </div>
  );
};
