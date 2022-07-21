import { Clock } from "./clock";
import { f32 } from "./types";
export declare abstract class Game {
    clock: Clock;
    fps: f32;
    paused: boolean;
    private acc;
    constructor({ clock }: {
        clock: Clock;
    });
    loop(): void;
    abstract render(): void;
    abstract update(dt: f32): void;
}
