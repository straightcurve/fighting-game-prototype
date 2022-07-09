import { MeshToonMaterial } from "three";
import { f32, i32 } from "../lib/types";
import { FGCharacter } from "./character";

export type AnimationComponent = {
  frame: i32;
  clip?: AnimationClip;
  elapsed: f32;
};

export type AnimationClip = {
  loop: boolean;
  start: i32;
  length: i32;
  fps: f32;
};

export function runAnimationSystem(dt: number, characters: FGCharacter[]) {
  for (let ci = 0; ci < characters.length; ci++) {
    const character = characters[ci];
    const animator = character.animator;
    const clip = animator.clip;
    const ct = animator.frame;

    const sprite = character.sprite;
    const th = sprite.userData.atlas.tileSize.x;
    const tv = sprite.userData.atlas.tileSize.y;

    const offsetX = (ct % th) / th;
    const offsetY = (tv - Math.floor(ct / th) - 1) / tv;
    if (Array.isArray(sprite.material)) return;

    (sprite.material as MeshToonMaterial).map?.offset.set(offsetX, offsetY);

    animator.elapsed += dt;

    if (!clip) continue;

    const fps = 1 / clip.fps;
    const elapsed = animator.elapsed;
    const left = elapsed - fps;
    if (left < 0) continue;

    animator.elapsed = left;
    if (animator.frame < clip.start + clip.length - 1) animator.frame++;
    else if (clip.loop) animator.frame = clip.start;
  }
}
