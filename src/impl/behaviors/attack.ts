import { NodeState, Node } from "../../lib/behavior-trees/node";
import { i32 } from "../../lib/types";

export abstract class TaskAttack extends Node {
  public cf: i32 = 0;
  public isAttacking: boolean = false;

  constructor(
    public frameData: {
      startup: i32;
      active: i32;
      recovery: i32;
    }
  ) {
    super();
  }

  public override evaluate() {
    if (!this.shouldEvaluate()) return NodeState.Failure;

    console.log("before update..", this.constructor.name);
    this.beforeUpdate();

    if (this.cf === 0) {
      console.log("cf 0..", this.constructor.name);
      this.cf =
        this.frameData.startup +
        this.frameData.active +
        this.frameData.recovery;
    }

    this.cf--;
    this.update();

    this.afterUpdate();

    if (this.cf > 0) return NodeState.Running;
    return NodeState.Failure;
  }

  public isActive() {
    return (
      this.cf <= this.frameData.recovery + this.frameData.active &&
      this.cf > this.frameData.recovery
    );
  }

  public isRecovery() {
    return this.cf <= this.frameData.recovery;
  }

  public abstract beforeUpdate(): void;
  public abstract update(): void;
  public abstract afterUpdate(): void;
  public abstract shouldEvaluate(): boolean;
}
