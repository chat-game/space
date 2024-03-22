import { useEffect, useState } from "react";

export const RabbitBlock = ({ start }: { start: { x: number; y: number } }) => {
  const size = 100;
  const height = (size * 64) / 100;

  const minX = 100;
  const maxX = 1200;
  const minY = 100;
  const maxY = 1200;

  const [y, setY] = useState(start.y);
  const [x, setX] = useState(start.x);

  const [movingY, setMovingY] = useState(2);
  const [movingX, setMovingX] = useState(-2);

  useEffect(() => {
    const repeatY = setInterval(() => {
      if (y <= minY) {
        setMovingY(2);
      }
      if (y >= maxY) {
        setMovingY(-2);
      }

      setY((prevState) => prevState + movingY);
    }, 850);

    const repeatX = setInterval(() => {
      if (x <= minX) {
        setMovingX(2);
      }
      if (x >= maxX) {
        setMovingX(-2);
      }

      setX((prevState) => prevState + movingX);
    }, 850);

    return () => {
      clearInterval(repeatY);
      clearInterval(repeatX);
    };
  }, [x, movingX, y, movingY]);

  const leftSprite = "creatures/rabbit1_left_64.png";
  const rightSprite = "creatures/rabbit1_right_64.png";

  return (
    <div className="fixed" style={{ zIndex: y + height - 32, top: y, left: x }}>
      <div style={{ marginTop: -height + 16, marginLeft: -height / 2 }}>
        <div className="relative">
          <img
            src={movingX > 0 ? rightSprite : leftSprite}
            alt=""
            className="w-fit animation-rabbit-hop"
            style={{ height: height }}
          />
        </div>
      </div>
    </div>
  );
};
