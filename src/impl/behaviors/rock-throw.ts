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
import { FGCharacter } from "../../lib/character";
import { createSprite, createSpriteFallback, Sprite } from "../../lib/sprite";
import { dt } from "../../lib/time";
import { getRoot, overlap } from "../../lib/utils";
import { TaskAttack } from "./attack";

export class TaskRockThrow extends TaskAttack {
  public cast!: Mesh;
  public rock!: Sprite;
  public hitbox!: Mesh;
  public ignore: Mesh[] = [];

  public override shouldEvaluate(): boolean {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return false;

    if (character.actionMap.LightAttack.held) this.isAttacking = true;

    return this.isAttacking;
  }

  public override beforeUpdate(): void {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return;

    const ca = character.data.chargeAttack;
    if (!ca) throw new Error("no charge attack");

    if (this.cf > 0) {
      if (this.rock) {
        const opacity = (ca.startup - this.frameData.startup) / ca.startup;
        if (Array.isArray(this.rock.material))
          this.rock.material.forEach((m) => (m.opacity = opacity));
        else this.rock.material.opacity = opacity;
      }
    }

    if (this.cf > 0 || this.cf < 0) return;

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
    this.rock = createSpriteFallback({
      colorMap: "assets/rock.png",
      tileSize: new Vector2(1, 1),
    });
    this.rock.position.y = 0.75;
    character.sprite.add(this.rock);
  }

  public override update(): void {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return;

    const ca = character.data.chargeAttack;
    if (!ca) throw new Error("no charge attack");

    if (this.isActive()) {
      if (this.cf === this.frameData.active + this.frameData.recovery) {
        let colliderGeo = new BoxBufferGeometry(1, 1, 0);
        let colliderMat = new MeshBasicMaterial({
          color: 0xff0000,
          wireframe: true,
        });
        this.hitbox = new Mesh(colliderGeo, colliderMat);
        this.hitbox.name = `${character.data.name} rock hitbox`;

        this.rock.add(this.hitbox);
      }

      let direction = 1;
      if (!character.facingRight) direction = -1;

      this.rock.position.x += direction * 2 * dt;
      this.rock.position.y -= 2 * dt;

      const hit = overlap(this.hitbox, character.game.colliders, this.ignore);
      if (!hit) return;

      this.ignore.push(hit);
      const root = getRoot(hit);
      const target: FGCharacter | undefined = root.userData.character;
      if (!target) return;

      target.takeDamage(60);
    } else if (this.isRecovery()) {
      character.sprite.remove(this.cast);
      character.sprite.remove(this.rock);
    }
  }

  public override afterUpdate(): void {
    if (this.cf === 0) this.isAttacking = false;
  }
}
