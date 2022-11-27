import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect, useRef } from "react";
import {
  setHeroDown,
  setHeroLeft,
  setHeroRight,
  setHeroUp,
} from "../redux/slices/hero";
import { FPS } from "./constants";

export const Hero = () => {
  const dispatch = useAppDispatch();
  const { x, y, direction, moving } = useAppSelector((state) => state.hero);

  const heroDivRef = useRef(null);

  // On hero position change
  useEffect(() => {
    if (!heroDivRef.current) return;

    //console.log(x, y);
  }, [x, y]);

  // On direction change
  useEffect(() => {
    if (!heroDivRef.current) return;
    // @ts-ignore
    heroDivRef.current?.setAttribute("data-walking", "true");
    // @ts-ignore
    heroDivRef.current?.setAttribute("data-facing", direction);
  }, [direction]);

  useEffect(() => {
    if (x === undefined || x === null) return;

    let intervalX: any;

    // how far to go
    const distanceX = Math.abs(moving.x - x);
    // where to go
    const direction = moving.x >= x ? "right" : "left";

    if (distanceX >= 1) {
      intervalX = setInterval(() => {
        if (direction === "right") dispatch(setHeroRight());
        if (direction === "left") dispatch(setHeroLeft());
      }, FPS);
    }

    return () => clearInterval(intervalX);
  }, [moving, x]);

  useEffect(() => {
    if (y === undefined || y === null) return;

    let intervalY: any;

    // how far to go
    const distanceY = Math.abs(moving.y - y);
    // where to go
    const direction = moving.y >= y ? "down" : "up";

    if (distanceY >= 1) {
      intervalY = setInterval(() => {
        if (direction === "down") dispatch(setHeroDown());
        if (direction === "up") dispatch(setHeroUp());
      }, FPS);
    }

    return () => clearInterval(intervalY);
  }, [moving, y]);

  return (
    <div
      ref={heroDivRef}
      className="hero"
      data-facing="down"
      data-walking="false"
    >
      <div className="shadow pixel-art"></div>
      <div className="hero_spritesheet pixel-art"></div>
    </div>
  );
};
