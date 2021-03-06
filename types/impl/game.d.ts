import * as THREE from "three";
import GUI, { Controller } from "lil-gui";
import { FGCharacter } from "../lib/character";
import { Game } from "../lib/game";
import { f32 } from "../lib/types";
import { Mesh } from "three";
import { Clock } from "../lib/clock";
export declare class FGame extends Game {
    activeScene: THREE.Scene;
    systems: ((dt: f32) => void)[];
    players: FGCharacter[];
    gui: GUICtrl[];
    addPlayers(...characters: FGCharacter[]): void;
    colliders: Mesh[];
    constructor({ clock }: {
        clock: Clock;
    });
    render(): void;
    update(dt: f32): void;
}
export declare type GUICtrl = {
    gui: GUI;
    name: Controller;
    health: Controller;
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
