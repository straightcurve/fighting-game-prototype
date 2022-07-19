import { Selector } from "../../lib/behavior-trees/selector";
import { BehaviorTree } from "../../lib/behavior-trees/tree";
import { FGCharacter } from "../../lib/character";
import { TaskIdle } from "./idle";
import { TaskPunch } from "./punch";
import { TaskWalk } from "./walk";
import { TaskWalkBack } from "./walk-back";
import { Node } from "../../lib/behavior-trees/node";
import { TaskRockThrow } from "./rock-throw";

export class PlayerBehaviorTree extends BehaviorTree {
  constructor(public character: FGCharacter) {
    super();
  }

  protected override setup(): Node {
    let root = new Selector([
      new Selector([
        //      TODO: implement input buffer
        //@ts-ignore
        new TaskRockThrow(this.character.data.chargeAttack),
        new TaskPunch(this.character.data.lightAttack),
      ]),
      new TaskWalk(),
      new TaskWalkBack(),
      new TaskIdle(),
    ]);
    root.setData("character", this.character);

    return root;
  }
}
