import { FGCharacter } from "./character";
import { i32 } from "./types";
/**
 * @deprecated
 */
export interface PlayerInput {
    x: boolean;
    start: boolean;
}
export declare type Action = "Left" | "Right" | "LightAttack" | "Start";
export declare type ActionTrigger = {
    triggered: boolean;
    held: boolean;
    data?: any;
    process?: (character: FGCharacter) => void;
};
export declare type KeyboardActionTrigger = {
    key: string;
} & ActionTrigger;
export declare type ButtonActionTrigger = {
    checkbutton: string;
} & ActionTrigger;
export declare type ActionMap = {
    [K in Action]: KeyboardActionTrigger | ButtonActionTrigger;
};
export declare enum CommandType {
    L = 0,
    F = 1,
    B = 2,
    FL = 3,
    BL = 4
}
export declare enum InputType {
    Back = 0,
    Forward = 1,
    LightAttack = 2
}
export declare type ExecutedAction = {
    type: InputType;
    frame: i32;
};
export declare type Command = {
    type: CommandType;
    priority: i32;
    inputs: Array<InputType>;
};
export declare class InputBuffer {
    commands: Command[];
    size: i32;
    private buffer;
    private current;
    constructor(commands: Command[], size?: i32);
    read(actions: ActionMap): void;
    push(action: InputType): void;
    clear(indexes: i32[]): void;
    match(): [command: Command | null, indexes: Array<i32>];
}
