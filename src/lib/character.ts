import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from "three";
import { Character } from "../impl/characters/base";
import { FGame } from "../impl/game";
import { BlockState, DeathState, IdleState } from "../impl/states";
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

  public change(state: State | null) {
    console.log(state);
    if (this.current) this.current.exit(this.character);
    this.current = state;
    if (this.current) this.current.enter(this.character);
  }

  public handle() {
    if (!this.current) return;

    const state = this.current.handle(this.character);
    if (state === null) return;

    this.change(state);
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
  public facingRight: boolean;
  public isBlocking: boolean;

  constructor({
    animator,
    data,
    sprite,
    actionMap,
    facingRight = true,
  }: {
    animator?: AnimationComponent;
    data: Character;
    sprite: Sprite;
    actionMap: ActionMap;
    facingRight?: boolean;
  }) {
    this.animator = animator || { frame: 0, elapsed: 0 };
    this.sprite = sprite;
    this.facingRight = facingRight;
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

    this.isBlocking = false;
  }

  public handle() {
    this.brain.handle();
  }

  public play(clip: AnimationClip) {
    this.animator.clip = clip;
    //@ts-ignore
    if (clip.start.right === undefined) {
      this.animator.frame = clip.start;
      return;
    }

    //@ts-ignore
    if (this.facingRight) this.animator.frame = clip.start.right;
    //@ts-ignore
    else this.animator.frame = clip.start.left;
  }

  public takeDamage(amount: f32) {
    if (this.health <= 0) return;
    if (this.isBlocking) {
      this.brain.change(new BlockState());
      return;
    }

    this.health -= amount;
    if (this.health <= 0) {
      this.brain.change(new DeathState());
    }
  }
}
