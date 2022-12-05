import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect, useRef, useState } from "react";
import {
  setCreatureMoving,
  setCreatureMovingTo,
  setCreaturePosition,
} from "../redux/slices/creatures";

export const Wolf = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch();
  const { x, y, moving, movingTo, speed } = useAppSelector(
    (state) =>
      state.creatures.small.find((creature) => creature.id === id) ||
      state.creatures.small[0]
  );

  const [wolfX, setWolfX] = useState(x);
  const [wolfY, setWolfY] = useState(y);

  // Create random walk
  useEffect(() => {
    if (moving) return;

    const randomInterval = Math.floor(Math.random() * 15000);

    const interval = setInterval(() => {
      const newX = Math.floor(Math.random() * 300);
      const newY = Math.floor(Math.random() * 300);

      dispatch(setCreatureMovingTo({ id, x: newX, y: newY }));
      console.log("Wolf is moving to", newX, newY);
    }, randomInterval);

    return () => clearInterval(interval);
  }, [moving]);

  // how far to go
  const distanceX = Math.abs(movingTo.x - wolfX);
  const distanceY = Math.abs(movingTo.y - wolfY);
  // where to go
  const directionX = movingTo.x >= wolfX ? "RIGHT" : "LEFT";
  const directionY = movingTo.y >= wolfY ? "DOWN" : "UP";

  const requestRef = useRef();
  const previousTimeRef = useRef();

  // const step = (time: number) => {
  //   if (previousTimeRef.current != undefined) {
  //     const deltaTime = time - previousTimeRef.current;
  //
  //     if (distanceX >= 0) {
  //       if (directionX === "RIGHT") {
  //         setWolfX((prevCount) => prevCount + deltaTime * speed);
  //         setCreaturePosition({ id, x: x + deltaTime * speed, y: wolfY });
  //       }
  //       if (directionX === "LEFT") {
  //         setWolfX((prevCount) => prevCount - deltaTime * speed);
  //         setCreaturePosition({ id, x: x - deltaTime * speed, y: wolfY });
  //       }
  //     }
  //
  //     if (distanceY >= 0) {
  //       if (directionY === "DOWN")
  //         setWolfY((prevCount) => prevCount + deltaTime * speed);
  //       if (directionY === "UP")
  //         setWolfY((prevCount) => prevCount - deltaTime * speed);
  //     }
  //   }
  //   // @ts-ignore
  //   previousTimeRef.current = time;
  //   // @ts-ignore
  //   requestRef.current = requestAnimationFrame(step);
  // };

  // useEffect(() => {
  //   // @ts-ignore
  //   requestRef.current = requestAnimationFrame(step);
  //   // @ts-ignore
  //   return () => cancelAnimationFrame(requestRef.current);
  // }, [x, y, wolfX, wolfY]);

  let lastFrameTime = 0;
  let fps = 0;

  const step = (time = 0) => {
    fps = Math.floor(1 / ((performance.now() - lastFrameTime) / 1000));
    lastFrameTime = time;

    if (distanceX >= 0) {
      if (directionX === "RIGHT") {
        setWolfX((prevCount) => prevCount + fps * speed);
        setCreaturePosition({ id, x: x + fps * speed, y: wolfY });
      }
      if (directionX === "LEFT") {
        setWolfX((prevCount) => prevCount - fps * speed);
        setCreaturePosition({ id, x: x - fps * speed, y: wolfY });
      }
    }

    if (distanceY >= 0) {
      if (directionY === "DOWN")
        setWolfY((prevCount) => prevCount + fps * speed);
      if (directionY === "UP") setWolfY((prevCount) => prevCount - fps * speed);
    }

    //requestAnimationFrame(step);
  };

  //requestAnimationFrame(step);

  // Is on target position?
  useEffect(() => {
    if (wolfX === undefined || wolfX === null) return;
    if (wolfY === undefined || wolfY === null) return;
    if (!moving) return;

    if (Math.floor(wolfX) === movingTo.x && Math.floor(wolfY) === movingTo.y) {
      console.log("Wolf is on target position");
      dispatch(setCreatureMoving({ id, isMoving: false }));
      dispatch(setCreaturePosition({ id, x: wolfX, y: wolfY }));
    }
  }, [x, y, wolfX, wolfY, moving, movingTo]);

  return null;
};
