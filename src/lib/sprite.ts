import * as THREE from "three";

export type SpriteAtlas = {
  tileSize: THREE.Vector2;
};

export type Sprite = THREE.Mesh & {
  userData: {
    atlas: SpriteAtlas;
  };
};

export function createSprite({
  colorMap,
  alphaMap,
  tileSize,
}: {
  colorMap: string;
  alphaMap?: string;
  tileSize: THREE.Vector2;
}): Sprite {
  const map = new THREE.TextureLoader().load(colorMap);
  map.magFilter = THREE.NearestFilter;

  const material = new THREE.MeshToonMaterial({
    map,
    color: 0xffffff,
    transparent: true,
  });
  if (alphaMap) {
    material.alphaMap = new THREE.TextureLoader().load(alphaMap);
  }

  const geo = new THREE.PlaneGeometry(1, 1);
  //@ts-ignore
  const sprite = new THREE.Mesh(geo, material) as Sprite;

  sprite.userData.atlas = {
    tileSize: tileSize.clone(),
  };
  map.repeat.set(
    1 / sprite.userData.atlas.tileSize.x,
    1 / sprite.userData.atlas.tileSize.y
  );

  return sprite;
}

export function createSpriteFallback({
  colorMap,
  tileSize,
}: {
  colorMap: string;
  tileSize: THREE.Vector2;
}): Sprite {
  const map = new THREE.TextureLoader().load(colorMap);
  map.magFilter = THREE.NearestFilter;

  const material = new THREE.SpriteMaterial({
    map,
  });

  const sprite = new THREE.Sprite(material);

  sprite.userData.atlas = {
    tileSize: tileSize.clone(),
  };
  map.repeat.set(
    1 / sprite.userData.atlas.tileSize.x,
    1 / sprite.userData.atlas.tileSize.y
  );

  //@ts-ignore
  return sprite;
}
