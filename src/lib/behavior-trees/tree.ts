import { Node } from "./node";

export abstract class BehaviorTree {
  private root!: Node;

  public start() {
    this.root = this.setup();
  }

  public update() {
    if (this.root) this.root.evaluate();
  }

  protected abstract setup(): Node;
}
