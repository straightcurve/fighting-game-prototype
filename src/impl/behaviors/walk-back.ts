import { NodeState, Node } from "../../lib/behavior-trees/node";
import { FGCharacter } from "../../lib/character";
import { CommandType } from "../../lib/input";
import { walkBack, walkBackLeft } from "../clips";

export class TaskWalkBack extends Node {
  public override evaluate() {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return NodeState.Failure;

    const [command, indexes] = character.ib.match();
    if (command) {
      if (command.type !== CommandType.B) return NodeState.Failure;

      character.ib.clear(indexes);
    } else return NodeState.Failure;

    character.isBlocking = true;

    if (character.facingRight) character.play(walkBack);
    else character.play(walkBackLeft);

    let direction = 1;
    if (!character.facingRight) direction = -1;

    character.sprite.position.x -= direction * 0.5 * (1 / 60);

    return NodeState.Success;
  }
}
