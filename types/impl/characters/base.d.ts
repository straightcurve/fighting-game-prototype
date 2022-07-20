import { Vector2 } from "three";
import { AnimationClip } from "../../lib/animation";
import { Command } from "../../lib/input";
import { f32, i32 } from "../../lib/types";
export declare type Ability = {
    startup: i32;
    active: i32;
    recovery: i32;
    hitbox?: {
        position: Vector2;
        size: Vector2;
    }[];
    clip: AnimationClip;
    command: Command;
};
export declare type Character = {
    name: string;
    maxHealth: f32;
    hurtbox: Vector2;
    sprite: {
        alphaMap: string;
        colorMap: string;
        tileSize: Vector2;
    };
    abilities: Ability[];
};
