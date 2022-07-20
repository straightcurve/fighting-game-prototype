import { NodeState, Node } from "../../lib/behavior-trees/node";
export declare class TaskClearBlock extends Node {
    evaluate(): NodeState;
}
export declare class CheckIfBlockStun extends Node {
    evaluate(): NodeState.Success | NodeState.Failure;
}
export declare class TaskBlock extends Node {
    evaluate(): NodeState.Success | NodeState.Failure;
}
