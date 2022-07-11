import { Node } from "./node";
export declare abstract class BehaviorTree {
    private root;
    start(): void;
    update(): void;
    protected abstract setup(): Node;
}
