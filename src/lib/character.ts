import { IdleState } from "../impl/states";
import { AnimationClip, AnimationComponent } from "./animation";
import { ActionMap } from "./input";
import { Sprite } from "./sprite";
import { f32 } from "./types";

export interface State {
  enter: (character: FGCharacter) => void;
  exit: (character: FGCharacter) => void;
  handle(character: FGCharacter): State | null;
  update: (dt: f32, character: FGCharacter) => void;
}

export class StateMachine {
  constructor(private character: FGCharacter) {}

  public current: State | null = null;

  public handle() {
    if (!this.current) return;

    const state = this.current.handle(this.character);
    if (state === null) return;

    this.current.exit(this.character);
    this.current = state;
    this.current.enter(this.character);
  }

  public update(dt: f32) {
    if (this.current) this.current.update(dt, this.character);
  }
}

export class FGCharacter {
  public animator: AnimationComponent;
  public brain: StateMachine;
  public sprite: Sprite;

  public actionMap: ActionMap;

  constructor({
    animator,
    sprite,
    actionMap,
  }: {
    animator?: AnimationComponent;
    sprite: Sprite;
    actionMap: ActionMap;
  }) {
    this.animator = animator || { frame: 0, elapsed: 0 };
    this.sprite = sprite;
    this.brain = new StateMachine(this);
    this.brain.current = new IdleState();
    this.brain.current.enter(this);
    this.actionMap = actionMap;
  }

  public handle() {
    this.brain.handle();
  }

  public play(clip: AnimationClip) {
    this.animator.clip = clip;
    this.animator.frame = clip.start;
  }
}
