import * as THREE from "three";
import { Controller } from "lil-gui";
import { FGCharacter } from "../lib/character";
import { Game } from "../lib/game";
import { f32 } from "../lib/types";
export declare class FGame extends Game {
    activeScene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    mainCamera: THREE.Camera;
    systems: ((dt: f32) => void)[];
    players: FGCharacter[];
    gui: GUICtrl[];
    addPlayers(...characters: FGCharacter[]): void;
    constructor();
    handleInput(): void;
    render(): void;
    update(dt: f32): void;
}
export declare type GUICtrl = {
    left: {
        triggered: Controller;
        held: Controller;
    };
    right: {
        triggered: Controller;
        held: Controller;
    };
    lightAttack: Controller;
    start: Controller;
    animator: {
        frame: Controller;
    };
};
