import { useAppDispatch, useAppSelector } from "../hooks";
import React, { useEffect, useState } from "react";
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

  // Random walk
  useEffect(() => {
    if (moving) return;

    const randomInterval = Math.floor(Math.random() * 15000);

    const interval = setInterval(() => {
      const newX = Math.floor(Math.random() * 1100);
      const newY = Math.floor(Math.random() * 1100);

      dispatch(setCreatureMovingTo({ id, x: newX, y: newY }));
    }, randomInterval);

    return () => clearInterval(interval);
  }, [moving]);

  // how far to go
  const distanceX = Math.abs(movingTo.x - wolfX);
  const distanceY = Math.abs(movingTo.y - wolfY);
  // where to go
  const directionX = movingTo.x >= wolfX ? "RIGHT" : "LEFT";
  const directionY = movingTo.y >= wolfY ? "DOWN" : "UP";

  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;

      if (distanceX >= 0) {
        if (directionX === "RIGHT")
          setWolfX((prevCount) => prevCount + deltaTime * speed);
        if (directionX === "LEFT")
          setWolfX((prevCount) => prevCount - deltaTime * speed);
      }

      if (distanceY >= 0) {
        if (directionY === "DOWN")
          setWolfY((prevCount) => prevCount + deltaTime * speed);
        if (directionY === "UP")
          setWolfY((prevCount) => prevCount - deltaTime * speed);
      }
    }
    // @ts-ignore
    previousTimeRef.current = time;
    // @ts-ignore
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    // @ts-ignore
    requestRef.current = requestAnimationFrame(animate);
    // @ts-ignore
    return () => cancelAnimationFrame(requestRef.current);
  }, [wolfX, wolfY]);

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

  return <div className="wolf" style={{ top: wolfY, left: wolfX }}></div>;
};
