import { Node, NodeState } from "./node";

export class Selector extends Node {
  public override evaluate() {
    for (const node of this.children) {
      switch (node.evaluate()) {
        case NodeState.Failure:
          continue;
        case NodeState.Success:
          this.state = NodeState.Success;
          return this.state;
        case NodeState.Running:
          this.state = NodeState.Running;
          return this.state;
        default:
          continue;
      }
    }

    this.state = NodeState.Failure;
    return this.state;
  }
}
