import * as THREE from "three";
import { f32 } from "./types";
export declare abstract class Game {
    clock: THREE.Clock;
    fps: f32;
    paused: boolean;
    private acc;
    constructor();
    loop(): void;
    abstract render(): void;
    abstract update(dt: f32): void;
}
