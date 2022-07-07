import { Box3, Mesh, Object3D, Scene } from "three";

export function overlap(hitbox: Mesh, hurtboxes: Mesh[], ignore: Mesh[] = []) {
  for (let hi = 0; hi < hurtboxes.length; hi++) {
    const hurtbox = hurtboxes[hi];
    if (overlapBox(hitbox, hurtbox) && ignore.indexOf(hurtbox) === -1)
      return hurtbox;
  }

  return null;
}

export function overlapBox(hitbox: Mesh, hurtbox: Mesh) {
  if (!hitbox.geometry.boundingBox) hitbox.geometry.computeBoundingBox();
  if (!hurtbox.geometry.boundingBox) hurtbox.geometry.computeBoundingBox();

  hitbox.updateMatrixWorld();
  hurtbox.updateMatrixWorld();

  let box1 = (hitbox.geometry.boundingBox as Box3).clone();
  box1.applyMatrix4(hitbox.matrixWorld);

  var box2 = (hurtbox.geometry.boundingBox as Box3).clone();
  box2.applyMatrix4(hurtbox.matrixWorld);

  return box1.intersectsBox(box2);
}

export function getRoot(object: Object3D) {
  let current = object;
  while (current.parent && !(current.parent as Scene).isScene)
    current = current.parent;
  return current;
}
