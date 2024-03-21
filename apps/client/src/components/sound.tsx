import { Howl } from "howler";

export const Sound = () => {
  const sound = new Howl({
    src: ["/sound/forest1.mp3"],
    loop: true,
  });

  sound.play();

  return <></>;
};
