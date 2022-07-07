import { FGCharacter, State } from "../lib/character";
import { f32 } from "../lib/types";
export declare class IdleState implements State {
    enter(character: FGCharacter): void;
    exit(): void;
    handle(character: FGCharacter): State | null;
    update(_dt: f32, _character: FGCharacter): void;
}
export declare class PunchState implements State {
    enter(character: FGCharacter): void;
    exit(_character: FGCharacter): void;
    handle(character: FGCharacter): State | null;
    update(_dt: f32, _character: FGCharacter): void;
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
