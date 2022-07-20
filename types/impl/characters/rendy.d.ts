import { Character } from "./base";
import { Node } from "../../lib/behavior-trees/node";
import { ActionMap } from "../../lib/input";
import { PlayerBehaviorTree } from "../behaviors/player.tree";
import { FGCharacter } from "../../lib/character";
export declare const Rendy: Character;
export declare class RendyBehaviorTree extends PlayerBehaviorTree {
    protected setup(): Node;
}
export declare function createRendyCharacter(actionMap: ActionMap): FGCharacter;
