import { FGame } from "../src/impl/game";
import { FGCharacter } from "../src/lib/character";
import { P1Controls, P2Controls } from "../src/impl/controls";
import {
  createRendyCharacter,
  createTonyCharacter,
} from "../src/impl/characters";
import { DirectionalLight, Vector2, Vector3 } from "three";
import { runAnimationSystem } from "../src/lib/animation";
import { f32 } from "../src/lib/types";
import { frame, nextFrame } from "../src/lib/time";
import { createSprite } from "../src/lib/sprite";
import { TestClock } from "./mocks";

describe("game", () => {
  let game: FGame;
  let p1: FGCharacter;
  let p2: FGCharacter;
  let clock: TestClock;

  beforeEach(() => {
    clock = new TestClock();
    game = new FGame({ clock });

    p1 = createTonyCharacter(P1Controls);
    p2 = createRendyCharacter(P2Controls);

    p1.sprite.position.set(-0.5, 0, 0);
    p2.sprite.position.set(0.5, 0, 0);

    game.addPlayers(p1, p2);

    game.activeScene.add(p1.sprite, p2.sprite);

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
  });
  it("should increase frame count", () => {
    expect(frame).toEqual(0);
    game.loop();
    expect(frame).toEqual(1);
  });
});
