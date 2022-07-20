import { css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { FGCharacter } from "./lib/character";
import { runAnimationSystem } from "./lib/animation";
import { createSprite } from "./lib/sprite";

//@ts-ignore
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";
import { f32 } from "./lib/types";
import { FGame } from "./impl/game";
import { ActionTrigger, KeyboardActionTrigger } from "./lib/input";
import { P1Controls, P2Controls } from "./impl/controls";
import { Tony } from "./impl/characters/tony";
import { Rendy } from "./impl/characters/rendy";
import { DirectionalLight, Vector2, Vector3 } from "three";
import { nextFrame } from "./lib/time";
import { TaskPunch } from "./impl/behaviors/punch";
import { TaskRockThrow } from "./impl/behaviors/rock-throw";

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
      data: Tony,
      sprite: createSprite(Tony.sprite),
      actionMap: P1Controls,
      abilities: [new TaskPunch(Tony.abilities[0])],
    });

    const p2 = new FGCharacter({
      data: Rendy,
      sprite: createSprite(Rendy.sprite),
      actionMap: P2Controls,
      facingRight: false,
      abilities: [
        new TaskRockThrow(Rendy.abilities[1]),
        new TaskPunch(Rendy.abilities[0]),
      ],
    });

    p1.sprite.position.set(-0.5, 0, 0);
    p2.sprite.position.set(0.5, 0, 0);

    game.addPlayers(p1, p2);

    game.activeScene.add(p1.sprite, p2.sprite);

    window.onkeydown = (ev) => {
      const check = (trigger: ActionTrigger, player: FGCharacter) => {
        const t = trigger as KeyboardActionTrigger;
        if (t.held) return;
        t.triggered = t.key === ev.key;
        if (t.process) t.process(player);
      };

      for (let pi = 0; pi < game.players.length; pi++) {
        const p = game.players[pi];
        for (const a in p.actionMap) {
          //@ts-ignore
          const trigger: ActionTrigger = p.actionMap[a];
          check(trigger, p);
        }
      }
    };

    window.onkeyup = (ev) => {
      const check = (trigger: ActionTrigger) => {
        const t = trigger as KeyboardActionTrigger;
        if (t.key === ev.key) t.held = false;
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

    const isFacingRight = (source: FGCharacter, other: FGCharacter) =>
      source.sprite
        .getWorldPosition(new Vector3())
        .sub(other.sprite.getWorldPosition(new Vector3())).x < 0;

    game.systems.push((dt: f32) => {
      p1.facingRight = isFacingRight(p1, p2);
      p2.facingRight = isFacingRight(p2, p1);

      runAnimationSystem(dt, [p1, p2]);

      for (const p of [p1, p2]) {
        p.ib.read(p.actionMap);
        p.bt.update();
      }

      nextFrame();
    });

    // const controls = new OrbitControls(
    //   game.mainCamera,
    //   game.renderer.domElement
    // );
    //
    // game.systems.push((_dt: f32) => {
    //   controls.update();
    // });

    const sunlight = new DirectionalLight(0xffffff, 1);
    game.activeScene.add(sunlight);

    const background = createSprite({
      colorMap: "assets/training.webp",
      tileSize: new Vector2(1, 1),
    });
    background.position.z = -1;
    background.position.y = 0.3;
    background.scale.multiplyScalar(3);
    background.scale.x *= 2;
    game.activeScene.add(background);

    game.mainCamera.position.y = 0.25;
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
