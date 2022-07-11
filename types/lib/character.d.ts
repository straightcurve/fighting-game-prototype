import { Mesh } from "three";
import { Character } from "../impl/characters/base";
import { FGame } from "../impl/game";
import { AnimationClip, AnimationComponent } from "./animation";
import { BehaviorTree } from "./behavior-trees/tree";
import { ActionMap } from "./input";
import { Sprite } from "./sprite";
import { f32 } from "./types";
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
    bt: BehaviorTree;
    constructor({ animator, data, sprite, actionMap, facingRight, }: {
        animator?: AnimationComponent;
        data: Character;
        sprite: Sprite;
        actionMap: ActionMap;
        facingRight?: boolean;
    });
    play(clip: AnimationClip): void;
    takeDamage(amount: f32): void;
}
