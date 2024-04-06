import type { GameObject } from "../../../../../packages/api-sdk/src";

export const RabbitBlock = ({ object }: { object: GameObject }) => {
  const size = 100;
  const height = (size * 64) / 100;
  const width = height;

  const leftSprite = "creatures/rabbit1_left_64.png";
  const rightSprite = "creatures/rabbit1_right_64.png";

  const zIndex = Math.round(object.y);

  return (
    <div
      className="fixed h-0 w-8"
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
        <div className="relative">
          <img
            src={object.direction === "LEFT" ? leftSprite : rightSprite}
            alt=""
            className={`w-fit ${
              object.state === "MOVING" && "animation-rabbit-hop"
            }`}
            style={{ height }}
          />
        </div>
      </div>
    </div>
  );
};
