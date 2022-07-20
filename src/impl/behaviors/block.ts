import { NodeState, Node } from "../../lib/behavior-trees/node";
import { FGCharacter } from "../../lib/character";
import { frame } from "../../lib/time";
import { block, blockLeft } from "../clips";

export class TaskClearBlock extends Node {
  public override evaluate() {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return NodeState.Failure;

    character.isBlocking = false;

    return NodeState.Failure;
  }
}

export class CheckIfBlockStun extends Node {
  public override evaluate() {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return NodeState.Failure;
    if (character.blockstun <= 0) return NodeState.Failure;

    return NodeState.Success;
  }
}

export class TaskBlock extends Node {
  public override evaluate() {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return NodeState.Failure;

    if (character.facingRight) {
      if (character.animator.clip != block) {
        character.play(block);
      }
    } else {
      if (character.animator.clip != blockLeft) {
        character.play(blockLeft);
      }
    }

    character.blockstun--;

    return NodeState.Success;
  }
}
