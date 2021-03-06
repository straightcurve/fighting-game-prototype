import { Clock } from "./clock";
import { dt } from "./time";
import { f32 } from "./types";

export abstract class Game {
  public clock: Clock;
  public fps: f32;
  public paused: boolean;

  private acc: f32;

  constructor({ clock }: { clock: Clock }) {
    this.clock = clock;
    this.fps = dt;
    this.acc = 0;
    this.paused = false;
  }

  public loop() {
    const dt = this.clock.getDelta();

    this.acc += dt;
    while (this.acc >= this.fps) {
      this.acc -= this.fps;
      if (this.paused) continue;

      this.update(this.fps);
    }

    this.render();
  }

  public abstract render(): void;
  public abstract update(dt: f32): void;
}
