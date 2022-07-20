import { Mesh } from "three";
import { Character } from "../impl/characters/base";
import { FGame } from "../impl/game";
import { AnimationClip, AnimationComponent } from "./animation";
import { Node } from "./behavior-trees/node";
import { BehaviorTree } from "./behavior-trees/tree";
import { ActionMap, InputBuffer } from "./input";
import { Sprite } from "./sprite";
import { f32, i32 } from "./types";
export declare class FGCharacter {
    animator: AnimationComponent;
    sprite: Sprite;
    actionMap: ActionMap;
    data: Character;
    hurtbox: Mesh;
    game: FGame;
    health: f32;
    facingRight: boolean;
    isBlocking: boolean;
    blockstun: i32;
    bt: BehaviorTree;
    ib: InputBuffer;
    constructor({ animator, data, sprite, actionMap, facingRight, abilities, }: {
        animator?: AnimationComponent;
        data: Character;
        sprite: Sprite;
        actionMap: ActionMap;
        facingRight?: boolean;
        abilities?: Node[];
    });
    play(clip: AnimationClip): void;
    takeDamage(amount: f32): void;
}
