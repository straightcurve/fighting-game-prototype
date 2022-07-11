import { BehaviorTree } from "../../lib/behavior-trees/tree";
import { FGCharacter } from "../../lib/character";
import { Node } from "../../lib/behavior-trees/node";
export declare class PlayerBehaviorTree extends BehaviorTree {
    character: FGCharacter;
    constructor(character: FGCharacter);
    protected setup(): Node;
}
