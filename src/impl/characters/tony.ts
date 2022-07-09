import { Vector2 } from "three";
import { Character } from "./base";

export const Tony: Character = {
  name: "Tony",
  maxHealth: 100,
  hurtbox: new Vector2(0.3, 0.65),
  sprite: {
    alphaMap: "assets/Tony.alpha.png",
    colorMap: "assets/Tony.png",
    tileSize: new Vector2(36, 16),
  },
  lightAttack: {
    clip: {
      loop: false,
      //@ts-ignore
      start: {
        right: 72,
        left: 72 + 36,
      },
      length: 1,
      get fps() {
        const la = Tony.lightAttack;
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
};
