import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from "three";
import { PlayerBehaviorTree } from "../impl/behaviors/player.tree";
import { Character } from "../impl/characters/base";
import { FGame } from "../impl/game";
import { AnimationClip, AnimationComponent } from "./animation";
import { ActionMap, CommandType, InputBuffer, InputType } from "./input";
import { Sprite } from "./sprite";
import { f32, i32 } from "./types";

export class FGCharacter {
  public animator: AnimationComponent;
  public sprite: Sprite;

  public actionMap: ActionMap;
  public data: Character;
  public hurtbox: Mesh;
  public game!: FGame;

  public health: f32;
  public facingRight: boolean;
  public isBlocking: boolean;
  public blockstun: i32 = 0;
  public hitstun: i32 = 0;

  public bt: PlayerBehaviorTree;
  public ib: InputBuffer;

  constructor({
    animator,
    data,
    sprite,
    actionMap,
    facingRight = true,
    behaviorTree,
  }: {
    animator?: AnimationComponent;
    data: Character;
    sprite: Sprite;
    actionMap: ActionMap;
    behaviorTree: PlayerBehaviorTree;
    facingRight?: boolean;
  }) {
    this.animator = animator || { frame: 0, elapsed: 0 };
    this.sprite = sprite;
    this.facingRight = facingRight;
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

    this.bt = behaviorTree;
    this.bt.start();
    this.bt.setCharacter(this);

    this.ib = new InputBuffer([
      { type: CommandType.B, inputs: [InputType.Back], priority: 0 },
      { type: CommandType.F, inputs: [InputType.Forward], priority: 0 },

      ...data.abilities.map((a) => a.command),
    ]);
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
      this.blockstun = 12;
      return;
    }

    this.hitstun = 12;
    this.health -= amount;
  }
}
