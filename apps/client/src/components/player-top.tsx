export const PlayerTopBlock = ({
  top,
  colorIndex,
}: { top: "BASIC"; colorIndex: number }) => {
  const color = colorIndex / 100; // from 0 to 100 => 0 to 1

  switch (top) {
    case "BASIC":
      return (
        <img
          src={"hero/top2_64.png"}
          alt=""
          className="absolute"
          style={{
            top: 0,
            left: 0,
            filter: `hue-rotate(${color}turn)`,
          }}
        />
      );
  }
};
