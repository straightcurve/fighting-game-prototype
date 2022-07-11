import { NodeState, Node } from "../../lib/behavior-trees/node";
import { FGCharacter } from "../../lib/character";
import { walkBack, walkBackLeft } from "../clips";

export class TaskWalkBack extends Node {
  public override evaluate() {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return NodeState.Failure;

    if (!character.facingRight && !character.actionMap.Right.held)
      return NodeState.Failure;
    if (character.facingRight && !character.actionMap.Left.held)
      return NodeState.Failure;

    if (character.facingRight) character.play(walkBack);
    else character.play(walkBackLeft);

    let direction = 1;
    if (!character.facingRight) direction = -1;

    character.sprite.position.x -= direction * 0.5 * (1 / 60);

    return NodeState.Success;
  }
}
