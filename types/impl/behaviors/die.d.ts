import { NodeState, Node } from "../../lib/behavior-trees/node";
export declare class CheckIfDead extends Node {
    evaluate(): NodeState.Success | NodeState.Failure;
}
export declare class TaskDie extends Node {
    evaluate(): NodeState.Success | NodeState.Failure;
}
