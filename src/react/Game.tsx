import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setHeroPosition } from "../redux/slices/hero";
import { renderHero } from "../render/hero";
import { renderBackground } from "../render/background";
import { renderFPS } from "../render/fps";
import { resizeCanvas } from "../helpers/resizeCanvas";

export const Game = () => {
  const dispatch = useAppDispatch();
  const { x, y } = useAppSelector((state) => state.hero);

  const canvasRef = useRef(null);

  let fps = 0;
  let lastFrameTime = 0;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    resizeCanvas(canvas);

    function step(time: number = 0) {
      if (!ctx) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Main render loop
      renderBackground(ctx);
      renderHero(ctx, { x, y });

      // FPS
      fps = Math.floor(1 / ((performance.now() - lastFrameTime) / 1000));
      lastFrameTime = time;
      renderFPS(ctx, fps);

      requestAnimationFrame(step);
    }
    step();

    // On remove - clear loop
    return () => {
      cancelAnimationFrame(lastFrameTime);
    };
  }, [x, y]);

  const handleGameCanvasClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const clickedX = event.pageX;
    const clickedY = event.pageY;

    dispatch(setHeroPosition({ x: clickedX, y: clickedY }));

    console.log("map clicked", event, clickedX, clickedY);
  };

  return (
    <canvas ref={canvasRef} onClick={handleGameCanvasClick} id="game-canvas" />
  );
};
