import { FGame } from "../src/impl/game";
import { FGCharacter } from "../src/lib/character";
import { P1Controls, P2Controls } from "../src/impl/controls";
import {
  createRendyCharacter,
  createTonyCharacter,
} from "../src/impl/characters";
import { DirectionalLight, Vector2, Vector3 } from "three";
import { runAnimationSystem } from "../src/lib/animation";
import { f32, i32 } from "../src/lib/types";
import { frame, nextFrame } from "../src/lib/time";
import { createSprite } from "../src/lib/sprite";
import { TestClock } from "./mocks";
import { TaskPunch } from "../src/impl/behaviors/punch";
import { TaskAttack } from "../src/impl/behaviors/attack";
import { TaskRockThrow } from "../src/impl/behaviors/rock-throw";

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

  type GameEvent = {
    frame: i32;
    action: (attacker: FGCharacter) => void;
  };

  function use(
    attacker: FGCharacter,
    task: TaskAttack,
    events: GameEvent[] = []
  ) {
    const ev = events.find((e) => e.frame === frame);
    if (ev) ev.action(attacker);

    task.evaluate();

    let frames =
      task.ability.startup + task.ability.active + task.ability.recovery - 1;

    while (frames--) {
      game.loop();

      const ev = events.find((e) => e.frame === frame);
      if (ev) ev.action(attacker);
    }

    attacker.actionMap.LightAttack.triggered = false;
    game.loop();
  }

  describe("task rock throw", () => {
    it("should consume armor if hit", () => {
      const punch = new TaskPunch(p1.data.abilities[0]);
      const framesLeft = punch.ability.active + punch.ability.recovery;
      const rock = new TaskRockThrow(p2.data.abilities[1]);

      const hp = p2.health;
      use(p2, rock, [
        {
          frame: 0,
          action: (attacker) => {
            attacker.actionMap.Left.held = true;
            attacker.actionMap.Left.process?.call(p2.actionMap.Left, p2);
            attacker.actionMap.LightAttack.triggered = true;
          },
        },
        {
          frame:
            rock.ability.startup +
            rock.ability.active +
            rock.ability.recovery -
            1,
          action: (attacker) => {
            attacker.actionMap.Left.held = false;
            attacker.actionMap.LightAttack.triggered = false;
          },
        },
      ]);
      expect(p2.armor).toEqual(3);

      use(p1, punch);
      expect(p2.armor).toEqual(2);

      use(p1, punch);
      expect(p2.armor).toEqual(1);

      use(p1, punch);
      expect(p2.armor).toEqual(0);

      use(p1, punch);
      expect(p2.health).toEqual(hp - 10);
      expect(p2.hitstun).toEqual(12 - framesLeft);
    });
  });

  describe("task punch", () => {
    it("should consume armor if hit", () => {
      const punch = new TaskPunch(p2.data.abilities[0]);

      const hp = p1.health;
      p1.armor = 3;
      use(p2, punch);
      expect(p1.armor).toEqual(2);

      use(p2, punch);
      expect(p1.armor).toEqual(1);

      use(p2, punch);
      expect(p1.armor).toEqual(0);

      use(p2, punch);
      expect(p1.health).toEqual(hp - 10);
    });

    it("should apply hitstun after consuming armor", () => {
      const punch = new TaskPunch(p2.data.abilities[0]);
      const framesLeft = punch.ability.active + punch.ability.recovery;

      const hp = p1.health;
      p1.armor = 3;
      use(p2, punch);
      expect(p1.armor).toEqual(2);
      expect(p1.hitstun).toEqual(0);

      use(p2, punch);
      expect(p1.armor).toEqual(1);
      expect(p1.hitstun).toEqual(0);

      use(p2, punch);
      expect(p1.armor).toEqual(0);
      expect(p1.hitstun).toEqual(0);

      use(p2, punch);
      expect(p1.health).toEqual(hp - 10);
      expect(p1.hitstun).toEqual(12 - framesLeft);
    });

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
