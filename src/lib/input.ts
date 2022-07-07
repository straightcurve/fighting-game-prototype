/**
 * @deprecated
 */
export interface PlayerInput {
  x: boolean;
  start: boolean;
}

export type Action = "LightAttack" | "Start";
export type ActionTrigger = { triggered: boolean };
export type KeyboardActionTrigger = { key: string } & ActionTrigger;
export type ButtonActionTrigger = { checkbutton: string } & ActionTrigger;
export type ActionMap = {
  [K in Action]: KeyboardActionTrigger | ButtonActionTrigger;
};
