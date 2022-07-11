export declare enum NodeState {
    Running = 0,
    Success = 1,
    Failure = 2
}
export declare abstract class Node {
    parent: Node | null;
    protected state: NodeState;
    protected children: Node[];
    private context;
    constructor(children?: Node[]);
    attach(to: Node): void;
    abstract evaluate(): NodeState;
    setData(key: string, value: any): void;
    getData<T>(key: string): T | null;
    clearData(key: string): boolean;
}
