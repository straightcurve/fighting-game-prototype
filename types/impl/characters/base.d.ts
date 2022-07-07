import { Vector2 } from "three";
import { AnimationClip } from "../../lib/animation";
import { f32, i32 } from "../../lib/types";
export declare type Character = {
    name: string;
    maxHealth: f32;
    hurtbox: Vector2;
    sprite: {
        spritePath: string;
        tileSize: Vector2;
    };
    lightAttack: {
        startup: i32;
        active: i32;
        recovery: i32;
        hitbox: {
            position: Vector2;
            size: Vector2;
        }[];
        clip: AnimationClip;
    };
};
