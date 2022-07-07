import * as THREE from "three";
import { f32 } from "./types";

export abstract class Game {
  public clock: THREE.Clock;
  public fps: f32;
  public paused: boolean;

  private acc: f32;

  constructor() {
    this.clock = new THREE.Clock();
    this.fps = 1 / 60;
    this.acc = 0;
    this.paused = false;
  }

  public loop() {
    const dt = this.clock.getDelta();

    this.handleInput();

    this.acc += dt;
    while (this.acc >= this.fps) {
      this.acc -= this.fps;
      if (this.paused) continue;

      this.update(this.fps);
    }

    this.render();
  }

  public abstract handleInput(): void;
  public abstract render(): void;
  public abstract update(dt: f32): void;
}
