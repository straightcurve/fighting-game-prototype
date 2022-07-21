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
import { createTonyCharacter } from "./impl/characters/tony";
import { createRendyCharacter } from "./impl/characters/rendy";
import {
  DirectionalLight,
  PerspectiveCamera,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import * as THREE from "three";
import { nextFrame } from "./lib/time";
import { Clock } from "./lib/clock";

export class FightingGame extends FGame {
  public renderer: THREE.WebGLRenderer;
  public mainCamera: THREE.Camera;

  constructor({ clock }: { clock: Clock }) {
    super({ clock });

    const renderer = new WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(this.loop.bind(this));
    this.renderer = renderer;

    const camera = new PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    camera.position.z = 1;
    this.mainCamera = camera;
  }

  public override render(): void {
    this.renderer.render(this.activeScene, this.mainCamera);
  }
}

@customElement("game-element")
export class GameElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 0rem;
    }
  `;

  public game = new FightingGame({ clock: new THREE.Clock() });
  constructor() {
    super();

    this.init(this.game);
  }

  private init(game: FightingGame) {
    const p1 = createTonyCharacter(P1Controls);
    const p2 = createRendyCharacter(P2Controls);

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
