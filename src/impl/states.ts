import {
  BoxBufferGeometry,
  DoubleSide,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  RGBAFormat,
  Vector2,
  VideoTexture,
} from "three";
import { FGCharacter, State } from "../lib/character";
import { createSprite, Sprite } from "../lib/sprite";
import { f32, i32 } from "../lib/types";
import { getRoot, overlap } from "../lib/utils";
import { die, idle, walk, walkBack } from "./clips";

export class IdleState implements State {
  public enter(character: FGCharacter) {
    character.play(idle);
  }

  public exit() {}

  public handle(character: FGCharacter): State | null {
    if (character.actionMap.LightAttack.triggered) return new PunchState();
    if (character.actionMap.LightAttack.held) return new ChargeState();
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

export class DeathState implements State {
  public enter(character: FGCharacter) {
    character.play(die);
  }

  public exit() {}

  public handle(_character: FGCharacter): State | null {
    return null;
  }

  public update(_dt: f32, _character: FGCharacter) {}
}

export class ChargeState implements State {
  public frameData!: {
    startup: i32;
    active: i32;
    recovery: i32;
  };

  public cast!: Mesh;
  public rock!: Sprite;
  public hitbox!: Mesh;
  public ignore: Mesh[] = [];

  public enter(character: FGCharacter) {
    //@ts-ignore
    const ca = character.data.chargeAttack;
    character.play(ca.clip);

    this.frameData = {
      startup: ca.startup,
      active: ca.active,
      recovery: ca.recovery,
    };

    let video = document.createElement("video");
    video.src =
      "https://images-ext-2.discordapp.net/external/WUZT3_16grLOQMgUFqXwT_S8NAYZKYIVL8zMqU34rTA/https/media.tenor.com/3jOLfxZvmeYAAAPo/neji-hyuga.mp4";
    video.crossOrigin = "anonymous";
    video.autoplay = true;
    video.load();
    video.play();

    let texture = new VideoTexture(video);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.format = RGBAFormat;

    const geo = new PlaneGeometry(2, 2, 4, 4);
    const mat = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
    });
    const cast = new Mesh(geo, mat);
    cast.rotation.x = (90 * Math.PI) / 180;
    cast.position.y = -0.35;

    character.sprite.add(cast);

    this.cast = cast;

    this.ignore.push(character.hurtbox);
    this.rock = createSprite({
      spritePath: "assets/rock.png",
      tileSize: new Vector2(1, 1),
    });
    this.rock.position.y = 0.75;
    character.sprite.add(this.rock);
  }

  public exit(character: FGCharacter) {
    character.sprite.remove(this.cast);
    character.sprite.remove(this.rock);
  }

  public handle(_character: FGCharacter): State | null {
    if (this.frameData.recovery <= 0) return new IdleState();

    return null;
  }

  public update(dt: f32, character: FGCharacter) {
    //@ts-ignore
    const ca = character.data.chargeAttack;

    this.rock.material.opacity =
      (ca.startup - this.frameData.startup) / ca.startup;

    if (this.frameData.startup > 0) this.frameData.startup--;
    else if (this.frameData.active > 0) {
      if (this.frameData.active === ca.active) {
        let colliderGeo = new BoxBufferGeometry(1, 1, 0);
        let colliderMat = new MeshBasicMaterial({
          color: 0xff0000,
          wireframe: true,
        });
        this.hitbox = new Mesh(colliderGeo, colliderMat);
        this.hitbox.name = `${character.data.name} rock hitbox`;

        this.rock.add(this.hitbox);
      }

      this.frameData.active--;

      this.rock.position.x += 2 * dt;
      this.rock.position.y -= 2 * dt;

      const hit = overlap(this.hitbox, character.game.colliders, this.ignore);
      if (!hit) return;

      this.ignore.push(hit);
      const root = getRoot(hit);
      const target: FGCharacter | undefined = root.userData.character;
      if (!target) return;

      target.takeDamage(60);
    } else if (this.frameData.recovery > 0) {
      this.frameData.recovery--;

      character.sprite.remove(this.cast);
      character.sprite.remove(this.rock);
    }
  }
}
