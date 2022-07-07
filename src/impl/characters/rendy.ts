import { Vector2 } from "three";
import { Character } from "./base";

export const Rendy: Character & any = {
  name: "Rendy",
  maxHealth: 200,
  hurtbox: new Vector2(0.3, 0.65),
  sprite: {
    spritePath: "assets/Char_3.png",
    tileSize: new Vector2(18, 16),
  },
  lightAttack: {
    clip: {
      loop: false,
      start: 36,
      length: 1,
      get fps() {
        const la = Rendy.lightAttack;
        return la.clip.length / (la.startup + la.active + la.recovery);
      },
    },
    startup: 5,
    active: 3,
    recovery: 8,
    hitbox: [
      {
        position: new Vector2(0.185),
        size: new Vector2(0.3, 0.2),
      },
      {
        position: new Vector2(0.185),
        size: new Vector2(0.3, 0.2),
      },
      {
        position: new Vector2(0.185),
        size: new Vector2(0.3, 0.2),
      },
    ],
  },
  chargeAttack: {
    clip: {
      loop: false,
      start: 18 * 5 + 0,
      length: 6,
      fps: 1.85,
    },
    startup: 120,
    active: 40,
    recovery: 8,
  },
};
