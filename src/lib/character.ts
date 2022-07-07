import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from "three";
import { Character } from "../impl/characters/base";
import { FGame } from "../impl/game";
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
  public data: Character;
  public hurtbox: Mesh;
  public game!: FGame;

  public health: f32;

  constructor({
    animator,
    data,
    sprite,
    actionMap,
  }: {
    animator?: AnimationComponent;
    data: Character;
    sprite: Sprite;
    actionMap: ActionMap;
  }) {
    this.animator = animator || { frame: 0, elapsed: 0 };
    this.sprite = sprite;
    this.brain = new StateMachine(this);
    this.brain.current = new IdleState();
    this.brain.current.enter(this);
    this.actionMap = actionMap;
    this.data = data;
    this.health = data.maxHealth;

    let colliderGeo = new BoxBufferGeometry(data.hurtbox.x, data.hurtbox.y, 0);
    let colliderMat = new MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    let collider = new Mesh(colliderGeo, colliderMat);
    this.sprite.add(collider);

    this.hurtbox = collider;
    this.hurtbox.userData.character = this;
    this.sprite.userData.character = this;
    this.hurtbox.name = data.name;
  }

  public handle() {
    this.brain.handle();
  }

  public play(clip: AnimationClip) {
    this.animator.clip = clip;
    this.animator.frame = clip.start;
  }

  public takeDamage(amount: f32) {
    this.health -= amount;
  }
}
