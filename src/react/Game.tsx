import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { renderFPS } from "../render/fps";
import { resizeCanvas } from "../helpers/resizeCanvas";
import { renderBackground } from "../render/background";
import { renderHero, renderHeroMovingTo } from "../render/hero";
import { useAnimationFrame } from "../hooks/useAnimationFrame";

const move = (object: any) => {
  if (!object.moving) return object;

  // how far to go
  const distanceX = Math.abs(object.movingTo.x - object.x);
  const distanceY = Math.abs(object.movingTo.y - object.y);
  // where to go
  const directionX = object.movingTo.x >= object.x ? "RIGHT" : "LEFT";
  const directionY = object.movingTo.y >= object.y ? "DOWN" : "UP";

  if (distanceX >= 0 && object.movingX) {
    if (directionX === "RIGHT") object.x = object.x + object.speed;
    if (directionX === "LEFT") object.x = object.x - object.speed;
  }

  if (distanceY >= 0 && object.movingY) {
    if (directionY === "DOWN") object.y = object.y + object.speed;
    if (directionY === "UP") object.y = object.y - object.speed;
  }

  // check if reached the destination
  if (Math.floor(object.x) == object.movingTo.x) object.movingX = false;
  if (Math.floor(object.y) == object.movingTo.y) object.movingY = false;
  if (!object.movingX && !object.movingY) object.moving = false;

  return object;
};

const heroPosition = {
  x: 150,
  y: 150,
  moving: false,
  movingX: false,
  movingY: false,
  movingTo: { x: 0, y: 0 },
  speed: 1,
};

export const Game = () => {
  const dispatch = useAppDispatch();
  const { x, y, isMoving, movingTo } = useAppSelector((state) => state.hero);

  const canvasRef = useRef(null);

  const step = (deltaTime = 0) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (
      canvas.width !== window.innerWidth ||
      canvas.height !== window.innerHeight
    ) {
      resizeCanvas(canvas);
    }

    // Move hero
    move(heroPosition);

    // Main render loop
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    renderBackground(ctx);

    renderHeroMovingTo(
      ctx,
      {
        x: heroPosition.movingTo.x,
        y: heroPosition.movingTo.y,
      },
      heroPosition.moving
    );
    renderHero(ctx, { x: heroPosition.x, y: heroPosition.y });

    renderFPS(ctx, Math.floor(1000 / deltaTime));
  };

  useAnimationFrame(step);

  const handleGameCanvasClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const clickedX = event.pageX;
    const clickedY = event.pageY;

    //dispatch(setHeroPosition({ x: clickedX, y: clickedY }));
    //dispatch(setHeroMovingTo({ x: clickedX, y: clickedY }));

    heroPosition.moving = true;
    heroPosition.movingX = true;
    heroPosition.movingY = true;
    heroPosition.movingTo = { x: clickedX, y: clickedY };

    console.log("map clicked", event, clickedX, clickedY);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onClick={handleGameCanvasClick}
        id="game-canvas"
      />
    </>
  );
};
