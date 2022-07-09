import * as THREE from "three";
export declare type SpriteAtlas = {
    tileSize: THREE.Vector2;
};
export declare type Sprite = THREE.Mesh & {
    userData: {
        atlas: SpriteAtlas;
    };
};
export declare function createSprite({ colorMap, alphaMap, tileSize, }: {
    colorMap: string;
    alphaMap?: string;
    tileSize: THREE.Vector2;
}): Sprite;
