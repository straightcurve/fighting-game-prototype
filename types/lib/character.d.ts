import { Mesh } from "three";
import { PlayerBehaviorTree } from "../impl/behaviors/player.tree";
import { Character } from "../impl/characters/base";
import { FGame } from "../impl/game";
import { AnimationClip, AnimationComponent } from "./animation";
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
    bt: PlayerBehaviorTree;
    ib: InputBuffer;
    constructor({ animator, data, sprite, actionMap, facingRight, behaviorTree, }: {
        animator?: AnimationComponent;
        data: Character;
        sprite: Sprite;
        actionMap: ActionMap;
        behaviorTree: PlayerBehaviorTree;
        facingRight?: boolean;
    });
    play(clip: AnimationClip): void;
    takeDamage(amount: f32): void;
}
