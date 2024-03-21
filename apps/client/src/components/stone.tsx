export const Stone = () => {
  const stone = {
    x: 1250,
    y: 200,
  };

  const size = 100;
  const height = (size * 128) / 100;

  const isShaking = false;

  return (
    <div
      className={`fixed ${isShaking && "animation-tree-shake"}`}
      style={{ zIndex: stone.y, top: stone.y, left: stone.x }}
    >
      <div style={{ marginTop: -height, marginLeft: -height / 2 }}>
        <img
          src={"stone/stone1_128.png"}
          alt=""
          className="w-fit"
          style={{ height: height }}
        />
      </div>
    </div>
  );
};
