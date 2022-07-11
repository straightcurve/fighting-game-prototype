import { Mesh } from "three";
import { TaskAttack } from "./attack";
export declare class TaskPunch extends TaskAttack {
    hitbox: Mesh;
    ignore: Mesh[];
    shouldEvaluate(): boolean;
    beforeUpdate(): void;
    update(): void;
    afterUpdate(): void;
}
