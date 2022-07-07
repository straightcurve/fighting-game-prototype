import { Mesh, Object3D } from "three";
export declare function overlap(hitbox: Mesh, hurtboxes: Mesh[], ignore?: Mesh[]): Mesh<import("three").BufferGeometry, import("three").Material | import("three").Material[]> | null;
export declare function overlapBox(hitbox: Mesh, hurtbox: Mesh): boolean;
export declare function getRoot(object: Object3D): Object3D<import("three").Event>;
