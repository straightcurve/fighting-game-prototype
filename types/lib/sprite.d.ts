import * as THREE from "three";
export declare type SpriteAtlas = {
    tileSize: THREE.Vector2;
};
export declare type Sprite = THREE.Sprite & {
    userData: {
        atlas: SpriteAtlas;
    };
};
export declare function createSprite({ spritePath, tileSize, }: {
    spritePath: string;
    tileSize: THREE.Vector2;
}): Sprite;
