import { NodeState, Node } from "../../lib/behavior-trees/node";
export declare class TaskIdle extends Node {
    evaluate(): NodeState.Success | NodeState.Failure;
}
