import { Mesh } from "three";
import { FGCharacter, State } from "../lib/character";
import { Sprite } from "../lib/sprite";
import { f32, i32 } from "../lib/types";
export declare class IdleState implements State {
    enter(character: FGCharacter): void;
    exit(): void;
    handle(character: FGCharacter): State | null;
    update(_dt: f32, _character: FGCharacter): void;
}
export declare class PunchState implements State {
    frameData: {
        startup: i32;
        active: i32;
        recovery: i32;
    };
    hitbox: Mesh;
    ignore: Mesh[];
    enter(character: FGCharacter): void;
    exit(_character: FGCharacter): void;
    handle(_character: FGCharacter): State | null;
    update(_dt: f32, character: FGCharacter): void;
}
export declare class WalkState implements State {
    enter(character: FGCharacter): void;
    exit(): void;
    handle(character: FGCharacter): State | null;
    update(dt: f32, character: FGCharacter): void;
}
export declare class WalkBackState implements State {
    enter(character: FGCharacter): void;
    exit(): void;
    handle(character: FGCharacter): State | null;
    update(dt: f32, character: FGCharacter): void;
}
export declare class DeathState implements State {
    enter(character: FGCharacter): void;
    exit(): void;
    handle(_character: FGCharacter): State | null;
    update(_dt: f32, _character: FGCharacter): void;
}
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
