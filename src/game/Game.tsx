import { ComponentProps, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setHeroMoving } from "../redux/slices/hero";
import { PIXEL_SIZE } from "./constants";
import { Interface } from "./Interface";
import { Hero } from "./Hero";

const mapRender = (mapDiv: HTMLDivElement, hero: any) => {
  if (!mapDiv) return;

  mapDiv.style.transform = `translate( ${-hero.x * PIXEL_SIZE}px, ${
    -hero.y * PIXEL_SIZE
  }px)`;

  window.requestAnimationFrame(() => {
    mapRender(mapDiv, hero);
  });
};

export const Game = (props: ComponentProps<any>) => {
  const { children } = props;

  const dispatch = useAppDispatch();
  const { x, y } = useAppSelector((state) => state.hero);

  const mapRef = useRef(null);

  const handleMapClick = (event: any) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const clickedX = Math.floor(event.clientX - windowWidth / 2);
    const clickedY = Math.floor(event.clientY - windowHeight / 2);

    dispatch(setHeroMoving({ x: x + clickedX, y: y + clickedY }));

    console.log("map clicked", event, clickedX, clickedY);
  };

  if (mapRef.current) {
    mapRender(mapRef.current, { x, y });
  }

  return (
    <div
      className="view"
      onClick={(event) => {
        handleMapClick(event);
      }}
    >
      <Hero />
      <div ref={mapRef} className="map pixel-art">
        {children}
      </div>
      <Interface />
    </div>
  );
};
