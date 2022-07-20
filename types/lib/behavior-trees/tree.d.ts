import { Node } from "./node";
export declare abstract class BehaviorTree {
    protected root: Node;
    start(): void;
    update(): void;
    protected abstract setup(): Node;
}
