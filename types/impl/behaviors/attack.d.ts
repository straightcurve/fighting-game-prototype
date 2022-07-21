import { NodeState, Node } from "../../lib/behavior-trees/node";
import { i32 } from "../../lib/types";
import { Ability } from "../characters/base";
export declare abstract class TaskAttack extends Node {
    ability: Ability;
    cf: i32;
    isAttacking: boolean;
    constructor(ability: Ability);
    evaluate(): NodeState.Running | NodeState.Failure;
    isActive(): boolean;
    isRecovery(): boolean;
    abstract beforeUpdate(): void;
    abstract update(): void;
    abstract afterUpdate(): void;
    abstract shouldEvaluate(): boolean;
}
