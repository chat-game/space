import { Howl } from "howler";

export const Sound = () => {
  const sound = new Howl({
    src: ["/sound/forest1.mp3"],
    loop: true,
    volume: 0.7,
  });

  sound.play();

  return <></>;
};
