import * as THREE from "three";
import { Controller } from "lil-gui";
import { FGCharacter } from "../lib/character";
import { Game } from "../lib/game";
import { f32 } from "../lib/types";
import { Mesh } from "three";
export declare class FGame extends Game {
    activeScene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    mainCamera: THREE.Camera;
    systems: ((dt: f32) => void)[];
    players: FGCharacter[];
    gui: GUICtrl[];
    addPlayers(...characters: FGCharacter[]): void;
    colliders: Mesh[];
    constructor();
    handleInput(): void;
    render(): void;
    update(dt: f32): void;
}
export declare type GUICtrl = {
    name: Controller;
    left: {
        triggered: Controller;
        held: Controller;
    };
    right: {
        triggered: Controller;
        held: Controller;
    };
    lightAttack: {
        triggered: Controller;
        held: Controller;
    };
    start: {
        triggered: Controller;
        held: Controller;
    };
    animator: {
        frame: Controller;
    };
};
