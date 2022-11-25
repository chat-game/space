import { ComponentProps, useEffect, useRef, useState } from "react";
import { CanvasContext } from "./CanvasContext";

const Hero = () => {
  const test = 1;

  return (
    <div style={{ position: "absolute", top: "50%", left: "50%" }}>
      <img src={"/person-pixel.svg"} width="60" alt={"hero"} />
    </div>
  );
};

const Wolf = () => {
  const test = 1;

  return (
    <div style={{ position: "absolute" }}>
      <img src={"/wolf-pixel.svg"} width="60" alt={"wolf"} />
    </div>
  );
};

const Grid = () => {
  const tileWidth = 80;

  const grid = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      grid.push(
        <div
          key={`${i}-${j}`}
          style={{
            position: "absolute",
            top: `${i * tileWidth}px`,
            left: `${j * tileWidth}px`,
            width: `${tileWidth}px`,
            height: `${tileWidth}px`,
            border: "1px solid black",
          }}
        />
      );
    }
  }

  return <>{grid}</>;
};

export const Game = (props: ComponentProps<any>) => {
  const { children } = props;

  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  const width = 10000;
  const height = 10000;

  useEffect(() => {
    if (!canvasRef.current) return;

    // @ts-ignore
    setCtx(canvasRef.current.getContext("2d"));
  }, [setCtx, canvasRef]);

  return (
    <CanvasContext.Provider value={ctx}>
      <Wolf />
      <Hero />
      <Grid />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ backgroundColor: "#fff5a6" }}
      />
      {children}
    </CanvasContext.Provider>
  );
};
