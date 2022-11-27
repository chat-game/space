import { useState } from "react";
import { useAppSelector } from "../hooks";

export const Wolf = () => {
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
