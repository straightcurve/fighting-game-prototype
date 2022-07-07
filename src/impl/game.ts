import * as THREE from "three";
import GUI, { Controller } from "lil-gui";

import { FGCharacter } from "../lib/character";
import { Game } from "../lib/game";
import { f32, i32 } from "../lib/types";

export class FGame extends Game {
  public activeScene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public mainCamera: THREE.Camera;

  public systems: ((dt: f32) => void)[];

  public players: FGCharacter[] = [];

  public gui: GUICtrl[] = [];

  public addPlayers(...characters: FGCharacter[]) {
    characters.forEach((character) => {
      this.players.push(character);

      this.gui.push(
        createGUICtrl(
          `P${this.players.length}`,
          character,
          getGUIPosition(this.players.length - 1)
        )
      );
    });
  }

  constructor() {
    super();

    this.activeScene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(this.loop.bind(this));
    this.renderer = renderer;

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    camera.position.z = 1;
    this.mainCamera = camera;

    this.systems = [];
  }

  public override handleInput(): void {
    let attemptedPause = false;

    for (let pi = 0; pi < this.players.length; pi++) {
      const p = this.players[pi];

      if (!attemptedPause) {
        attemptedPause = attemptedPause || p.actionMap.Start.triggered;

        if (attemptedPause) this.paused = !this.paused;
      }

      p.brain.handle();
    }

    this.gui.forEach((gui) => {
      gui.left.triggered.updateDisplay();
      gui.left.held.updateDisplay();
      gui.right.triggered.updateDisplay();
      gui.right.held.updateDisplay();
      gui.lightAttack.updateDisplay();
      gui.start.updateDisplay();
      gui.animator.frame.updateDisplay();
    });

    //  consume inputs to avoid weird requestAnimationFrame bugs
    for (let pi = 0; pi < this.players.length; pi++) {
      const p = this.players[pi];
      for (const a in p.actionMap) {
        //@ts-ignore
        const trigger: ActionTrigger = p.actionMap[a];
        if (trigger.triggered) trigger.held = true;
        trigger.triggered = false;
      }
    }
  }

  public override render(): void {
    this.renderer.render(this.activeScene, this.mainCamera);
  }

  public override update(dt: f32): void {
    for (let si = 0; si < this.systems.length; si++) {
      const run = this.systems[si];
      run(dt);
    }
  }
}

function getGUIPosition(playerIndex: i32) {
  switch (playerIndex) {
    case 0:
      return {
        top: "1rem",
        left: "1rem",
      };
    case 1:
      return {
        top: "1rem",
        right: "1rem",
      };
    case 2:
      return {
        bottom: "1rem",
        left: "1rem",
      };
    case 3:
      return {
        bottom: "1rem",
        right: "1rem",
      };
  }

  return {};
}

export type GUICtrl = {
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

function createGUICtrl(
  name: string,
  character: FGCharacter,
  position: {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
  }
): GUICtrl {
  const container = document.createElement("div");
  container.id = `${name}-input`;
  container.style.position = "absolute";
  if (position.top) container.style.top = position.top;
  if (position.left) container.style.left = position.left;
  if (position.bottom) container.style.bottom = position.bottom;
  if (position.right) container.style.right = position.right;
  document.body.appendChild(container);

  const gui = new GUI({
    container,
  });
  return {
    left: {
      triggered: gui
        .add(character.actionMap.Left, "triggered")
        .name(`${name} Left Tap`)
        .listen(false),
      held: gui
        .add(character.actionMap.Left, "held")
        .name(`${name} Left Hold`)
        .listen(false),
    },
    right: {
      triggered: gui
        .add(character.actionMap.Right, "triggered")
        .name(`${name} Right Tap`)
        .listen(false),
      held: gui
        .add(character.actionMap.Right, "held")
        .name(`${name} Right Hold`)
        .listen(false),
    },
    lightAttack: gui
      .add(character.actionMap.LightAttack, "triggered")
      .name(`${name} Light Attack`)
      .listen(false),
    start: gui
      .add(character.actionMap.Start, "triggered")
      .name(`${name} Start`)
      .listen(false),
    animator: {
      frame: gui
        .add(character.animator, "frame")
        .name(`${name} Frame`)
        .listen(false),
    },
  };
}
