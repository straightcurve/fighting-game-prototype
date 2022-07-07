import { f32, i32 } from "../lib/types";
import { FGCharacter } from "./character";
export declare type AnimationComponent = {
    frame: i32;
    clip?: AnimationClip;
    elapsed: f32;
};
export declare type AnimationClip = {
    loop: boolean;
    start: i32;
    length: i32;
    fps: f32;
};
export declare function runAnimationSystem(dt: number, characters: FGCharacter[]): void;
