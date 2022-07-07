import { Mesh } from "three";
import { Character } from "../impl/characters/base";
import { FGame } from "../impl/game";
import { AnimationClip, AnimationComponent } from "./animation";
import { ActionMap } from "./input";
import { Sprite } from "./sprite";
import { f32 } from "./types";
export interface State {
    enter: (character: FGCharacter) => void;
    exit: (character: FGCharacter) => void;
    handle(character: FGCharacter): State | null;
    update: (dt: f32, character: FGCharacter) => void;
}
export declare class StateMachine {
    private character;
    constructor(character: FGCharacter);
    current: State | null;
    handle(): void;
    update(dt: f32): void;
}
export declare class FGCharacter {
    animator: AnimationComponent;
    brain: StateMachine;
    sprite: Sprite;
    actionMap: ActionMap;
    data: Character;
    hurtbox: Mesh;
    game: FGame;
    health: f32;
    constructor({ animator, data, sprite, actionMap, }: {
        animator?: AnimationComponent;
        data: Character;
        sprite: Sprite;
        actionMap: ActionMap;
    });
    handle(): void;
    play(clip: AnimationClip): void;
    takeDamage(amount: f32): void;
}
