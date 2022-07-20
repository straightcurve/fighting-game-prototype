import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from "three";
import { FGCharacter } from "../../lib/character";
import { CommandType } from "../../lib/input";
import { getRoot, overlap } from "../../lib/utils";
import { TaskAttack } from "./attack";

export class TaskPunch extends TaskAttack {
  public hitbox!: Mesh;
  public ignore: Mesh[] = [];

  public override shouldEvaluate(): boolean {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return false;

    const [command, indexes] = character.ib.match();
    if (command && command.type === CommandType.L) {
      this.isAttacking = true;
      character.ib.clear(indexes);
    }

    return this.isAttacking;
  }

  public override beforeUpdate(): void {
    if (this.cf > 0 || this.cf < 0) return;

    const character = this.getData<FGCharacter>("character");
    if (character === null) return;

    const la = character.data.abilities[0];
    character.play(la.clip);

    let colliderGeo = new BoxBufferGeometry(0, 0, 0);
    let colliderMat = new MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    this.hitbox = new Mesh(colliderGeo, colliderMat);
    this.hitbox.name = `${character.data.name} punch hitbox`;
    character.sprite.add(this.hitbox);

    while (this.ignore.length) this.ignore.shift();
    this.ignore.push(character.hurtbox);
  }

  public override update(): void {
    const character = this.getData<FGCharacter>("character");
    if (character === null) return;

    if (this.isActive()) {
      const la = character.data.abilities[0];
      if (!la.hitbox) return;

      const hitbox = la.hitbox[this.cf - this.frameData.recovery - 1];
      const geo = new BoxBufferGeometry(hitbox.size.x, hitbox.size.y, 0);
      this.hitbox.geometry = geo;

      let direction = 1;
      if (!character.facingRight) direction = -1;
      this.hitbox.position.x = direction * hitbox.position.x;
      this.hitbox.position.y = direction * hitbox.position.y;

      const hit = overlap(this.hitbox, character.game.colliders, this.ignore);
      if (!hit) return;

      this.ignore.push(hit);
      const root = getRoot(hit);
      const target: FGCharacter | undefined = root.userData.character;
      if (!target) return;

      target.takeDamage(10);
    } else if (this.isRecovery()) {
      character.sprite.remove(this.hitbox);
    }
  }

  public override afterUpdate(): void {
    if (this.cf === 0) this.isAttacking = false;
  }
}
