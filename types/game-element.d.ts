import { LitElement } from "lit";
import { FGame } from "./impl/game";
import * as THREE from "three";
import { Clock } from "./lib/clock";
export declare class FightingGame extends FGame {
    renderer: THREE.WebGLRenderer;
    mainCamera: THREE.Camera;
    constructor({ clock }: {
        clock: Clock;
    });
    render(): void;
}
export declare class GameElement extends LitElement {
    static styles: import("lit").CSSResult;
    game: FightingGame;
    constructor();
    private init;
    render(): HTMLCanvasElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "game-element": GameElement;
    }
}
