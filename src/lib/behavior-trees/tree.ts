import { Node } from "./node";

export abstract class BehaviorTree {
  protected root!: Node;

  public start() {
    this.root = this.setup();
  }

  public update() {
    if (this.root) this.root.evaluate();
  }

  protected abstract setup(): Node;
}
