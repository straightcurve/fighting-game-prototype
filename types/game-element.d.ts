import { LitElement } from "lit";
import { FGame } from "./impl/game";
export declare class GameElement extends LitElement {
    static styles: import("lit").CSSResult;
    game: FGame;
    constructor();
    private init;
    render(): HTMLCanvasElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "game-element": GameElement;
    }
}
