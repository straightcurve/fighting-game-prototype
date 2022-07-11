import { NodeState, Node } from "../../lib/behavior-trees/node";
import { i32 } from "../../lib/types";
export declare abstract class TaskAttack extends Node {
    frameData: {
        startup: i32;
        active: i32;
        recovery: i32;
    };
    cf: i32;
    isAttacking: boolean;
    constructor(frameData: {
        startup: i32;
        active: i32;
        recovery: i32;
    });
    evaluate(): NodeState.Running | NodeState.Failure;
    isActive(): boolean;
    isRecovery(): boolean;
    abstract beforeUpdate(): void;
    abstract update(): void;
    abstract afterUpdate(): void;
    abstract shouldEvaluate(): boolean;
}
