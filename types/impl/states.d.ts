import { Mesh } from "three";
import { FGCharacter } from "../lib/character";
import { Sprite } from "../lib/sprite";
import { f32, i32 } from "../lib/types";
export declare type State = {};
export declare class ChargeState implements State {
    frameData: {
        startup: i32;
        active: i32;
        recovery: i32;
    };
    cast: Mesh;
    rock: Sprite;
    hitbox: Mesh;
    ignore: Mesh[];
    enter(character: FGCharacter): void;
    exit(character: FGCharacter): void;
    handle(_character: FGCharacter): State | null;
    update(dt: f32, character: FGCharacter): void;
}
