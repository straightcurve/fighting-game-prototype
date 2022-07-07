import { Mesh, Object3D } from "three";
import { f32 } from "./types";
export declare function overlap(hitbox: Mesh, hurtboxes: Mesh[], ignore?: Mesh[]): Mesh<import("three").BufferGeometry, import("three").Material | import("three").Material[]> | null;
export declare function overlapBox(hitbox: Mesh, hurtbox: Mesh): boolean;
export declare function getRoot(object: Object3D): Object3D<import("three").Event>;
export declare function degToRad(degrees: f32): number;
