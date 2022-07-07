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
