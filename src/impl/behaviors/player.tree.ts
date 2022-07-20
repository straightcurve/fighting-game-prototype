import { BehaviorTree } from "../../lib/behavior-trees/tree";
import { FGCharacter } from "../../lib/character";

export abstract class PlayerBehaviorTree extends BehaviorTree {
  public setCharacter(character: FGCharacter) {
    if (!this.root) return this;

    this.root.setData("character", character);
    return this;
  }
}
