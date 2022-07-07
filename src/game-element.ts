import { css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { Vector2 } from "three";

import { FGCharacter } from "./lib/character";
import { runAnimationSystem } from "./lib/animation";
import { createSprite } from "./lib/sprite";

import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";
import { f32 } from "./lib/types";
import { FGame } from "./impl/game";
import { ActionTrigger, KeyboardActionTrigger } from "./lib/input";

@customElement("game-element")
export class GameElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 0rem;
    }
  `;

  public game = new FGame();

  constructor() {
    super();

    this.init(this.game);
  }

  private init(game: FGame) {
    const p1 = new FGCharacter({
      sprite: createSprite({
        spritePath: "assets/Char_3.png",
        tileSize: new Vector2(18, 16),
      }),
      actionMap: {
        LightAttack: {
          key: "e",
          triggered: false,
        },
        Start: {
          key: "z",
          triggered: false,
        },
      },
    });

    const p2 = new FGCharacter({
      sprite: createSprite({
        spritePath: "assets/Char_4.png",
        tileSize: new Vector2(18, 16),
      }),
      actionMap: {
        LightAttack: {
          key: "m",
          triggered: false,
        },
        Start: {
          key: "/",
          triggered: false,
        },
      },
    });

    p1.sprite.position.set(-0.5, 0, 0);
    p2.sprite.position.set(0.5, 0, 0);

    game.addPlayers(p1, p2);

    game.activeScene.add(p1.sprite, p2.sprite);

    window.onkeydown = (ev) => {
      const check = (trigger: ActionTrigger) => {
        const t = trigger as KeyboardActionTrigger;
        t.triggered = t.key === ev.key;
      };

      for (let pi = 0; pi < game.players.length; pi++) {
        const p = game.players[pi];
        for (const a in p.actionMap) {
          //@ts-ignore
          const trigger: ActionTrigger = p.actionMap[a];
          check(trigger);
        }
      }
    };

    game.systems.push((dt: f32) => {
      for (let pi = 0; pi < game.players.length; pi++) {
        const p = game.players[pi];
        p.brain.update(dt);
      }
    });

    game.systems.push((dt: f32) => {
      runAnimationSystem(dt, [p1, p2]);
    });

    const controls = new OrbitControls(
      game.mainCamera,
      game.renderer.domElement
    );

    game.systems.push((_dt: f32) => {
      controls.update();
    });
  }

  render() {
    return this.game.renderer.domElement;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "game-element": GameElement;
  }
}
