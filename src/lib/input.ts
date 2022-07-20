import { FGCharacter } from "./character";
import { frame } from "./time";
import { i32 } from "./types";

/**
 * @deprecated
 */
export interface PlayerInput {
  x: boolean;
  start: boolean;
}

export type Action = "Left" | "Right" | "LightAttack" | "Start";
export type ActionTrigger = {
  triggered: boolean;
  held: boolean;
  data?: any;
  process?: (character: FGCharacter) => void;
};
export type KeyboardActionTrigger = { key: string } & ActionTrigger;
export type ButtonActionTrigger = { checkbutton: string } & ActionTrigger;
export type ActionMap = {
  [K in Action]: KeyboardActionTrigger | ButtonActionTrigger;
};

export enum CommandType {
  L,
  F,
  B,
  FL,
  BL,
}

export enum InputType {
  Back,
  Forward,
  LightAttack,
}

export type ExecutedAction = {
  type: InputType;
  frame: i32;
};

export type Command = {
  type: CommandType;
  priority: i32;
  inputs: Array<InputType>;
};

export class InputBuffer {
  private buffer: (ExecutedAction | null)[] = [];
  private current: i32 = 0;

  constructor(public commands: Command[], public size: i32 = 10) {}

  public read(actions: ActionMap) {
    if (actions.Left.triggered || actions.Left.held)
      this.push(actions.Left.data.direction);

    if (actions.Right.triggered || actions.Right.held)
      this.push(actions.Right.data.direction);

    if (actions.LightAttack.triggered) this.push(InputType.LightAttack);
  }

  public push(action: InputType) {
    this.buffer[this.current] = { type: action, frame };
    this.current++;
    this.current %= this.size;
  }

  public clear(indexes: i32[]) {
    indexes.forEach((i) => (this.buffer[i] = null));
  }

  public match(): [command: Command | null, indexes: Array<i32>] {
    let matched: Command | null = null;
    let indexes: i32[] = [];

    const comboDropoffFrameCount = 6;

    for (let c = 0; c < this.commands.length; c++) {
      const command = this.commands[c];
      if (matched && command.priority < matched.priority) continue;

      let ci = 0;
      let last: ExecutedAction | null = null;
      for (let i = 0; i < this.buffer.length; i++) {
        const input = this.buffer[i];
        if (!input) continue;

        if (input.type === command.inputs[ci]) {
          if (
            last !== null &&
            input.frame - last.frame > comboDropoffFrameCount
          )
            continue;

          ci++;
          indexes.push(i);
          last = input;
        }

        if (ci === command.inputs.length) {
          matched = command;
          break;
        }
      }
    }

    return [matched, indexes];
  }
}
