import { ComponentProps, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Interface } from "./Interface";

const mapRender = (mapDiv: HTMLDivElement, hero: any) => {
  if (!mapDiv) return;

  // mapDiv.style.transform = `translate( ${-hero.x * PIXEL_SIZE}px, ${
  //   -hero.y * PIXEL_SIZE
  // }px)`;

  // window.scrollTo({
  //   top: hero.y,
  //   left: hero.x,
  //   behavior: "smooth",
  // });

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
    const clickedX = event.pageX;
    const clickedY = event.pageY;

    // dispatch(setHeroMoving({ x: clickedX, y: clickedY }));
    //
    // window.scrollTo({
    //   top: event.clientY,
    //   left: event.clientX,
    //   behavior: "smooth",
    // });

    console.log("map clicked", event, clickedX, clickedY);
  };

  return (
    <>
      <div className="view" onClick={handleMapClick}>
        <Interface />

        {/*<div*/}
        {/*  ref={mapRef}*/}
        {/*  className="map pixel-art"*/}
        {/*  onClick={(event) => {*/}
        {/*    handleMapClick(event);*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {children}*/}
        {/*  <Hero />*/}
        {/*  <Wolf id={1} />*/}
        {/*  <Wolf id={2} />*/}
        {/*  <Wolf id={3} />*/}
        {/*</div>*/}
      </div>
    </>
  );
};
