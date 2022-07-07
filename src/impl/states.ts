import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from "three";
import { FGCharacter, State } from "../lib/character";
import { f32, i32 } from "../lib/types";
import { getRoot, overlap } from "../lib/utils";
import { idle, walk, walkBack } from "./clips";

export class IdleState implements State {
  public enter(character: FGCharacter) {
    character.play(idle);
  }

  public exit() {}

  public handle(character: FGCharacter): State | null {
    if (character.actionMap.LightAttack.triggered) return new PunchState();
    if (character.actionMap.Left.held) return new WalkBackState();
    if (character.actionMap.Right.held) return new WalkState();

    return null;
  }

  public update(_dt: f32, _character: FGCharacter) {}
}

export class PunchState implements State {
  public frameData!: {
    startup: i32;
    active: i32;
    recovery: i32;
  };
  public hitbox!: Mesh;

  public ignore: Mesh[] = [];

  public enter(character: FGCharacter) {
    const la = character.data.lightAttack;
    character.play(la.clip);

    this.frameData = {
      startup: la.startup,
      active: la.active,
      recovery: la.recovery,
    };

    let colliderGeo = new BoxBufferGeometry(0, 0, 0);
    let colliderMat = new MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    this.hitbox = new Mesh(colliderGeo, colliderMat);
    this.hitbox.name = `${character.data.name} punch hitbox`;
    character.sprite.add(this.hitbox);

    this.ignore.push(character.hurtbox);
  }

  public exit(_character: FGCharacter) {}

  public handle(_character: FGCharacter): State | null {
    if (this.frameData.recovery <= 0) return new IdleState();

    return null;
  }

  public update(_dt: f32, character: FGCharacter) {
    const la = character.data.lightAttack;

    if (this.frameData.startup > 0) this.frameData.startup--;
    else if (this.frameData.active > 0) {
      this.frameData.active--;

      const hitbox = la.hitbox[la.hitbox.length - this.frameData.active - 1];
      const geo = new BoxBufferGeometry(hitbox.size.x, hitbox.size.y, 0);
      this.hitbox.geometry = geo;
      this.hitbox.position.x = hitbox.position.x;
      this.hitbox.position.y = hitbox.position.y;

      const hit = overlap(this.hitbox, character.game.colliders, this.ignore);
      if (!hit) return;

      this.ignore.push(hit);
      const root = getRoot(hit);
      const target: FGCharacter | undefined = root.userData.character;
      if (!target) return;

      target.takeDamage(10);
    } else if (this.frameData.recovery > 0) {
      this.frameData.recovery--;

      character.sprite.remove(this.hitbox);
    }
  }
}

export class WalkState implements State {
  public enter(character: FGCharacter) {
    character.play(walk);
  }

  public exit() {}

  public handle(character: FGCharacter): State | null {
    if (character.actionMap.LightAttack.triggered) return new PunchState();
    if (character.actionMap.Left.held) return new WalkBackState();
    if (character.actionMap.Right.held) return null;

    return new IdleState();
  }

  public update(dt: f32, character: FGCharacter) {
    character.sprite.position.x += 0.5 * dt;
  }
}

export class WalkBackState implements State {
  public enter(character: FGCharacter) {
    character.play(walkBack);
  }

  public exit() {}

  public handle(character: FGCharacter): State | null {
    if (character.actionMap.LightAttack.triggered) return new PunchState();
    if (character.actionMap.Left.held) return null;
    if (character.actionMap.Right.held) return new WalkState();

    return new IdleState();
  }

  public update(dt: f32, character: FGCharacter) {
    character.sprite.position.x -= 0.5 * dt;
  }
}
