import { Howl } from "howler";

export const SoundLayer = () => {
  const sound = new Howl({
    src: ["/sound/forest1.mp3"],
    loop: true,
    volume: 0.5,
  });

  sound.play();

  return <></>;
};
