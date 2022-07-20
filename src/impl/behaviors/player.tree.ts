import { Selector } from "../../lib/behavior-trees/selector";
import { BehaviorTree } from "../../lib/behavior-trees/tree";
import { FGCharacter } from "../../lib/character";
import { TaskIdle } from "./idle";
import { TaskWalk } from "./walk";
import { TaskWalkBack } from "./walk-back";
import { Node } from "../../lib/behavior-trees/node";
import { CheckIfDead, TaskDie } from "./die";
import { Sequence } from "../../lib/behavior-trees/sequence";
import { CheckIfBlockStun, TaskBlock, TaskClearBlock } from "./block";

export class PlayerBehaviorTree extends BehaviorTree {
  constructor(public character: FGCharacter, public abilities: Node[] = []) {
    super();
  }

  protected override setup(): Node {
    let root = new Selector([
      new TaskClearBlock(),
      new Sequence([new CheckIfBlockStun(), new TaskBlock()]),
      new Sequence([new CheckIfDead(), new TaskDie()]),
      new Selector(this.abilities),
      new TaskWalk(),
      new TaskWalkBack(),
      new TaskIdle(),
    ]);
    root.setData("character", this.character);

    return root;
  }
}
