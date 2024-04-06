import type { GameObjectTree } from "../../../../../packages/api-sdk/src";

export const TreeBlock = ({ object }: { object: GameObjectTree }) => {
  const size = Math.round(object.size);
  const height = (size * 128) / 100;
  const width = height;
  const zIndex = Math.round(object.y);

  const sprite = `tree/tree${object.type}_128.png`;

  const isShaking = object.state === "CHOPPING";

  return (
    <div
      className={`fixed h-0 w-16 ${
        isShaking ? "animation-tree-shake" : "animation-tree-wind-shake"
      }`}
      style={{ zIndex, top: object.y, left: object.x }}
    >
      <div
        className="-z-10 absolute bg-zinc-900/5 rounded-full"
        style={{
          width: width * 0.65,
          height: height * 0.45,
          top: -height * 0.35,
        }}
      />
      <div style={{ width, marginTop: -height, marginLeft: -width / 4 }}>
        <img src={sprite} alt="" className="w-fit" style={{ height }} />
      </div>
    </div>
  );
};
