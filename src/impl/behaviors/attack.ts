import { NodeState, Node } from "../../lib/behavior-trees/node";
import { i32 } from "../../lib/types";
import { Ability } from "../characters/base";

export abstract class TaskAttack extends Node {
  public cf: i32 = 0;
  public isAttacking: boolean = false;

  constructor(public ability: Ability) {
    super();
  }

  public override evaluate() {
    if (!this.shouldEvaluate()) return NodeState.Failure;

    this.beforeUpdate();

    if (this.cf === 0) {
      this.cf =
        this.ability.startup + this.ability.active + this.ability.recovery;
    }

    this.cf--;
    this.update();

    this.afterUpdate();

    if (this.cf > 0) return NodeState.Running;
    return NodeState.Failure;
  }

  public isActive() {
    return (
      this.cf <= this.ability.recovery + this.ability.active &&
      this.cf > this.ability.recovery
    );
  }

  public isRecovery() {
    return this.cf <= this.ability.recovery;
  }

  public cancel() {
    console.log("canceled");
    this.cf = 0;
    this.isAttacking = false;
  }

  public abstract beforeUpdate(): void;
  public abstract update(): void;
  public abstract afterUpdate(): void;
  public abstract shouldEvaluate(): boolean;
}
