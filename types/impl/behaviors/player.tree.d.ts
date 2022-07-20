import { BehaviorTree } from "../../lib/behavior-trees/tree";
import { FGCharacter } from "../../lib/character";
import { Node } from "../../lib/behavior-trees/node";
export declare class PlayerBehaviorTree extends BehaviorTree {
    character: FGCharacter;
    abilities: Node[];
    constructor(character: FGCharacter, abilities?: Node[]);
    protected setup(): Node;
}
