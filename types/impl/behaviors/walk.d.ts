import { NodeState, Node } from "../../lib/behavior-trees/node";
export declare class TaskWalk extends Node {
    evaluate(): NodeState.Success | NodeState.Failure;
}
