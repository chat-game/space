import { Howl } from "howler";
import chop1Audio from "../assets/audio/chop-1.wav";
import fireBurn1Audio from "../assets/audio/fire-1.wav";
import forest1Audio from "../assets/audio/forest-1.mp3";
import handPunch1Audio from "../assets/audio/hand-punch-1.wav";
import marchWithHorns1Audio from "../assets/audio/marching-with-horns-1.wav";
import mine1Audio from "../assets/audio/mine-1.wav";
import wagon1Audio from "../assets/audio/wagon-1.wav";

type SoundName =
  | "chop-hit"
  | "mine-hit"
  | "hand-hit"
  | "marching-with-horns"
  | "forest-background"
  | "wagon-moving"
  | "fire-burn";

export class AudioManager {
  public chop1 = new Howl({
    src: chop1Audio,
  });

  public mine1 = new Howl({
    src: mine1Audio,
    rate: 0.7,
  });

  public handPunch1 = new Howl({
    src: handPunch1Audio,
    rate: 0.5,
  });

  public marchWithHorns1 = new Howl({
    src: marchWithHorns1Audio,
  });

  public forest1 = new Howl({
    src: forest1Audio,
    loop: true,
  });

  public wagon1 = new Howl({
    src: wagon1Audio,
    rate: 0.7,
  });

  public fireBurn1 = new Howl({
    src: fireBurn1Audio,
  });

  getSounds(name: SoundName): Howl[] {
    switch (name) {
      case "chop-hit":
        return [this.chop1];
      case "mine-hit":
        return [this.mine1];
      case "hand-hit":
        return [this.handPunch1];
      case "marching-with-horns":
        return [this.marchWithHorns1];
      case "forest-background":
        return [this.forest1];
      case "wagon-moving":
        return [this.wagon1];
      case "fire-burn":
        return [this.fireBurn1];
      default:
        return [];
    }
  }

  play({ name, volume }: { name: SoundName; volume: number }) {
    const sounds = this.getSounds(name);
    if (sounds.length > 0) {
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      sound.volume(volume);
      sound.play();
    }
  }

  playBackgroundSound() {
    return this.play({ name: "forest-background", volume: 0.5 });
  }

  playCampfireSound() {
    if (this.fireBurn1.playing()) {
      return;
    }
    return this.play({ name: "fire-burn", volume: 0.7 });
  }

  playWagonMovingSound() {
    if (this.wagon1.playing()) {
      return;
    }
    return this.play({ name: "wagon-moving", volume: 0.08 });
  }

  playRaidSound() {
    return this.play({ name: "marching-with-horns", volume: 0.7 });
  }

  playChopWithAxeSound() {
    if (this.chop1.playing()) {
      return;
    }
    return this.play({ name: "chop-hit", volume: 0.3 });
  }

  playMineWithPickaxeSound() {
    if (this.mine1.playing()) {
      return;
    }
    return this.play({ name: "mine-hit", volume: 0.4 });
  }

  playHandPunch() {
    if (this.handPunch1.playing()) {
      return;
    }
    return this.play({ name: "hand-hit", volume: 0.2 });
  }
}
