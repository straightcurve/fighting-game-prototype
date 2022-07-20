import { BehaviorTree } from "../../lib/behavior-trees/tree";
import { FGCharacter } from "../../lib/character";
export declare abstract class PlayerBehaviorTree extends BehaviorTree {
    setCharacter(character: FGCharacter): this;
}
