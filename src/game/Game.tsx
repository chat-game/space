import { ComponentProps, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setHeroDown,
  setHeroLeft,
  setHeroMoving,
  setHeroRight,
  setHeroUp,
} from "../redux/slices/hero";
import { PIXEL_SIZE } from "./constants";

const Hero = () => {
  const dispatch = useAppDispatch();
  const { x, y, direction, moving } = useAppSelector((state) => state.hero);

  const heroDivRef = useRef(null);

  // key pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        dispatch(setHeroUp());
      }
      if (event.key === "ArrowDown") {
        dispatch(setHeroDown());
      }
      if (event.key === "ArrowLeft") {
        dispatch(setHeroLeft());
      }
      if (event.key === "ArrowRight") {
        dispatch(setHeroRight());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, heroDivRef]);

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
    if (!x) return;

    const FPS = 1000 / 60;
    let intervalX: any;

    // how far to go
    const distanceX = Math.abs(moving.x - x);

    if (distanceX >= 1) {
      // where to go
      const direction = moving.x >= x ? "right" : "left";

      intervalX = setInterval(() => {
        //console.log(`moving ${direction}`);
        // move
        if (direction === "right") {
          dispatch(setHeroRight());
        }
        if (direction === "left") {
          dispatch(setHeroLeft());
        }
      }, FPS);
    }

    return () => {
      clearInterval(intervalX);
    };
  }, [moving, x]);

  useEffect(() => {
    if (!y) return;

    const FPS = 1000 / 60;
    let intervalY: any;

    // how far to go
    const distanceY = Math.abs(moving.y - y);

    if (distanceY >= 1) {
      // where to go
      const direction = moving.y >= y ? "down" : "up";

      intervalY = setInterval(() => {
        //console.log(`moving ${direction}`);
        if (direction === "down") {
          dispatch(setHeroDown());
        }
        if (direction === "up") {
          dispatch(setHeroUp());
        }
      }, FPS);
    }

    return () => {
      clearInterval(intervalY);
    };
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
      {/*<span*/}
      {/*  style={{*/}
      {/*    position: "absolute",*/}
      {/*    color: "#000",*/}
      {/*    bottom: -12,*/}
      {/*    fontSize: 10,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  x {x} y {y}*/}
      {/*</span>*/}
      {/*<span*/}
      {/*  style={{*/}
      {/*    position: "absolute",*/}
      {/*    color: "#000",*/}
      {/*    bottom: 5,*/}
      {/*    right: 10,*/}
      {/*    fontSize: 10,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {direction}*/}
      {/*</span>*/}
    </div>
  );
};

const Wolf = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const hero = useAppSelector((state) => state.hero);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (hero.x === position.x && hero.y === position.y) {
  //       return;
  //     } else {
  //       if (hero.x <= position.x) {
  //         setPosition((prev) => ({ x: prev.x - 1, y: prev.y }));
  //       }
  //       if (hero.x > position.x) {
  //         setPosition((prev) => ({ x: prev.x + 1, y: prev.y }));
  //       }
  //       if (hero.y <= position.y) {
  //         setPosition((prev) => ({ x: prev.x, y: prev.y - 1 }));
  //       }
  //       if (hero.y > position.y) {
  //         setPosition((prev) => ({ x: prev.x, y: prev.y + 1 }));
  //       }
  //     }
  //   }, 5);
  //   return () => clearInterval(interval);
  // }, [hero, position]);

  return (
    <div style={{ position: "absolute", top: position.y, left: position.x }}>
      {/*<div style={{ display: "none" }}>*/}
      {/*  <img id="wolf" src="/wolf-pixel.svg" width="200" height="200" alt="" />*/}
      {/*</div>*/}
      {/*<img src={"/wolf-pixel.svg"} width="60" alt={"wolf"} />*/}
    </div>
  );
};

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
    </div>
  );
};
