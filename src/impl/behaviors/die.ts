import { NodeState, Node } from "../../lib/behavior-trees/node";
import { FGCharacter } from "../../lib/character";
import { die, dieLeft } from "../clips";

export class CheckIfDead extends Node {
  public override evaluate() {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return NodeState.Failure;
    if (character.health > 0) return NodeState.Failure;

    return NodeState.Success;
  }
}

export class TaskDie extends Node {
  public override evaluate() {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return NodeState.Failure;

    if (character.facingRight) {
      if (character.animator.clip != die) {
        character.play(die);
      }
    } else {
      if (character.animator.clip != dieLeft) {
        character.play(dieLeft);
      }
    }

    return NodeState.Success;
  }
}
