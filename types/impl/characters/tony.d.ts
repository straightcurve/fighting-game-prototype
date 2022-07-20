import { Node } from "../../lib/behavior-trees/node";
import { FGCharacter } from "../../lib/character";
import { ActionMap } from "../../lib/input";
import { PlayerBehaviorTree } from "../behaviors/player.tree";
import { Character } from "./base";
export declare const Tony: Character;
export declare class TonyBehaviorTree extends PlayerBehaviorTree {
    protected setup(): Node;
}
export declare function createTonyCharacter(actionMap: ActionMap): FGCharacter;
