import { NodeState, Node } from "../../lib/behavior-trees/node";
import { FGCharacter } from "../../lib/character";
import { hit, hitLeft } from "../clips";

export class CheckIfHitStun extends Node {
  public override evaluate() {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return NodeState.Failure;
    if (character.hitstun <= 0) return NodeState.Failure;

    return NodeState.Success;
  }
}

export class TaskHit extends Node {
  public override evaluate() {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return NodeState.Failure;

    if (character.facingRight) {
      if (character.animator.clip != hit) {
        character.play(hit);
      }
    } else {
      if (character.animator.clip != hitLeft) {
        character.play(hitLeft);
      }
    }

    character.hitstun--;

    return NodeState.Success;
  }
}
