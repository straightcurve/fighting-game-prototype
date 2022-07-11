import { NodeState, Node } from "../../lib/behavior-trees/node";
import { FGCharacter } from "../../lib/character";
import { idle, idleLeft } from "../clips";

export class TaskIdle extends Node {
  public override evaluate() {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return NodeState.Failure;

    if (character.facingRight) {
      if (character.animator.clip != idle) {
        character.play(idle);
      }
    } else {
      if (character.animator.clip != idleLeft) {
        character.play(idleLeft);
      }
    }

    return NodeState.Success;
  }
}
