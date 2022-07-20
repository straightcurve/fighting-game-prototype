import { Mesh } from "three";
import { Sprite } from "../../lib/sprite";
import { TaskAttack } from "./attack";
export declare class TaskRockThrow extends TaskAttack {
    cast: Mesh;
    rock: Sprite;
    hitbox: Mesh;
    ignore: Mesh[];
    shouldEvaluate(): boolean;
    beforeUpdate(): void;
    update(): void;
    afterUpdate(): void;
}
