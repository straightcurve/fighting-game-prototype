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
import { nextFrame } from "../src/lib/time";
import { createSprite } from "../src/lib/sprite";
import { TestClock } from "./mocks";
import { TaskPunch } from "../src/impl/behaviors/punch";

describe("character", () => {
  let game: FGame;
  let p1: FGCharacter;
  let p2: FGCharacter;
  let clock: TestClock;

  beforeEach(() => {
    clock = new TestClock();
    game = new FGame({ clock });

    p1 = createTonyCharacter(P1Controls);
    p2 = createRendyCharacter(P2Controls);

    p1.sprite.position.set(-0.1, 0, 0);
    p2.sprite.position.set(0.1, 0, 0);

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
  describe("task punch", () => {
    it("should apply hitstun on first active frame", () => {
      const punch = new TaskPunch(p2.data.abilities[0]);
      punch.setData("character", p2);

      p2.actionMap.LightAttack.triggered = true;
      punch.evaluate();

      let framesTillActive = p2.data.abilities[0].startup - 1;
      while (framesTillActive--) {
        game.loop();
        const msg = `framesTillActive: ${framesTillActive}`;
        expect({
          msg,
          hitstun: p1.hitstun,
        }).toEqual({
          msg,
          hitstun: 0,
        });
      }

      expect({
        hitstun: p1.hitstun,
      }).toEqual({
        hitstun: 0,
      });

      game.loop();

      expect({
        hitstun: p1.hitstun,
      }).toEqual({
        hitstun: 12,
      });
    });

    it("should apply blockstun on first active frame", () => {
      const punch = new TaskPunch(p2.data.abilities[0]);
      punch.setData("character", p2);

      p1.actionMap.Left.held = true;
      p1.actionMap.Left.process?.call(p1.actionMap.Left, p1);

      p2.actionMap.LightAttack.triggered = true;
      punch.evaluate();

      let framesTillActive = p2.data.abilities[0].startup - 1;
      while (framesTillActive--) {
        game.loop();
        expect(p1.isBlocking).toEqual(true);
        const msg = `framesTillActive: ${framesTillActive}`;
        expect({
          msg,
          blocking: p1.isBlocking,
          blockstun: p1.blockstun,
        }).toEqual({
          msg,
          blocking: true,
          blockstun: 0,
        });
      }

      expect({
        blocking: p1.isBlocking,
        blockstun: p1.blockstun,
      }).toEqual({
        blocking: true,
        blockstun: 0,
      });

      game.loop();

      expect({
        blocking: p1.isBlocking,
        blockstun: p1.blockstun,
      }).toEqual({
        blocking: true,
        blockstun: 12,
      });
    });
  });

  it("should block during active frames", () => {
    p1.actionMap.Left.held = true;
    p1.actionMap.Left.process?.call(p1.actionMap.Left, p1);

    p2.actionMap.LightAttack.triggered = true;

    let blockstunFrameCount = 12;

    let framesTillActive = p2.data.abilities[0].startup - 1;
    while (framesTillActive--) {
      game.loop();
      expect(p1.isBlocking).toEqual(true);
      expect(p1.blockstun).toBeLessThanOrEqual(0);
    }

    let framesActive = p2.data.abilities[0].active;
    while (framesActive--) {
      game.loop();
      expect(p1.blockstun).toEqual(blockstunFrameCount);
      expect(p1.isBlocking).toEqual(true);

      blockstunFrameCount--;
    }

    p1.actionMap.Left.held = false;

    let framesRecovery = p2.data.abilities[0].recovery;
    while (framesRecovery--) {
      game.loop();

      const msg = `frames: ${framesRecovery} | blockstunFrameCount: ${blockstunFrameCount}`;
      expect({ msg, blocking: p1.isBlocking }).toEqual({
        msg,
        blocking: blockstunFrameCount > 0,
      });

      blockstunFrameCount--;
    }

    let frames = blockstunFrameCount;
    while (frames--) {
      game.loop();
      const msg = `frames: ${frames} | blockstunFrameCount: ${blockstunFrameCount}`;
      expect({ msg, blocking: p1.isBlocking }).toEqual({
        msg,
        blocking: blockstunFrameCount > 0,
      });

      blockstunFrameCount--;
    }
  });
});
