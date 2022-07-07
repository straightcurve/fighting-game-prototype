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
    constructor({ animator, sprite, actionMap, }: {
        animator?: AnimationComponent;
        sprite: Sprite;
        actionMap: ActionMap;
    });
    handle(): void;
    play(clip: AnimationClip): void;
}
