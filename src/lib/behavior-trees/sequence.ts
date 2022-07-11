import { Node, NodeState } from "./node";

export class Sequence extends Node {
  public override evaluate() {
    let anyChildRunning = false;

    for (const node of this.children) {
      switch (node.evaluate()) {
        case NodeState.Failure:
          this.state = NodeState.Failure;
          return this.state;
        case NodeState.Success:
          continue;
        case NodeState.Running:
          anyChildRunning = true;
          continue;
        default:
          this.state = NodeState.Success;
          return this.state;
      }
    }

    this.state = anyChildRunning ? NodeState.Running : NodeState.Success;
    return this.state;
  }
}
