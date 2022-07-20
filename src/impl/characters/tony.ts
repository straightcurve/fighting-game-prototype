import { Vector2 } from "three";
import { Node } from "../../lib/behavior-trees/node";
import { Selector } from "../../lib/behavior-trees/selector";
import { Sequence } from "../../lib/behavior-trees/sequence";
import { FGCharacter } from "../../lib/character";
import { ActionMap, CommandType, InputType } from "../../lib/input";
import { createSprite } from "../../lib/sprite";
import {
  CheckIfBlockStun,
  TaskBlock,
  TaskClearBlock,
} from "../behaviors/block";
import { CheckIfDead, TaskDie } from "../behaviors/die";
import { TaskIdle } from "../behaviors/idle";
import { PlayerBehaviorTree } from "../behaviors/player.tree";
import { TaskPunch } from "../behaviors/punch";
import { TaskWalk } from "../behaviors/walk";
import { TaskWalkBack } from "../behaviors/walk-back";
import { Character } from "./base";

export const Tony: Character = {
  name: "Tony",
  maxHealth: 100,
  hurtbox: new Vector2(0.3, 0.65),
  sprite: {
    alphaMap: "assets/Tony.alpha.png",
    colorMap: "assets/Tony.png",
    tileSize: new Vector2(36, 16),
  },
  abilities: [
    {
      clip: {
        loop: false,
        //@ts-ignore
        start: {
          right: 72,
          left: 72 + 36,
        },
        length: 1,
        get fps() {
          const la = Tony.abilities[0];
          return la.clip.length / (la.startup + la.active + la.recovery);
        },
      },
      startup: 5,
      active: 3,
      recovery: 8,
      hitbox: [
        {
          position: new Vector2(0.185),
          size: new Vector2(0.3, 0.2),
        },
        {
          position: new Vector2(0.185),
          size: new Vector2(0.3, 0.2),
        },
        {
          position: new Vector2(0.185),
          size: new Vector2(0.3, 0.2),
        },
      ],
      command: {
        type: CommandType.L,
        inputs: [InputType.LightAttack],
        priority: 1,
      },
    },
  ],
};

export class TonyBehaviorTree extends PlayerBehaviorTree {
  protected override setup(): Node {
    return new Selector([
      new TaskClearBlock(),
      new Sequence([new CheckIfBlockStun(), new TaskBlock()]),
      new Sequence([new CheckIfDead(), new TaskDie()]),
      new Selector([new TaskPunch(Tony.abilities[0])]),
      new TaskWalk(),
      new TaskWalkBack(),
      new TaskIdle(),
    ]);
  }
}

export function createTonyCharacter(actionMap: ActionMap) {
  return new FGCharacter({
    data: Tony,
    behaviorTree: new TonyBehaviorTree(),
    sprite: createSprite(Tony.sprite),
    actionMap,
  });
}
