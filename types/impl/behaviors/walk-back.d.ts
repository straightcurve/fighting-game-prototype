import { NodeState, Node } from "../../lib/behavior-trees/node";
export declare class TaskWalkBack extends Node {
    evaluate(): NodeState.Success | NodeState.Failure;
}
