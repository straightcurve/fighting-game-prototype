import * as THREE from "three";

export type SpriteAtlas = {
  tileSize: THREE.Vector2;
};

export type Sprite = THREE.Sprite & {
  userData: {
    atlas: SpriteAtlas;
  };
};

export function createSprite({
  spritePath,
  tileSize,
}: {
  spritePath: string;
  tileSize: THREE.Vector2;
}): Sprite {
  const map = new THREE.TextureLoader().load(spritePath);
  map.magFilter = THREE.NearestFilter;

  const material = new THREE.SpriteMaterial({ map });

  const sprite = new THREE.Sprite(material) as Sprite;
  sprite.userData.atlas = {
    tileSize: tileSize.clone(),
  };
  map.repeat.set(
    1 / sprite.userData.atlas.tileSize.x,
    1 / sprite.userData.atlas.tileSize.y
  );

  return sprite;
}
