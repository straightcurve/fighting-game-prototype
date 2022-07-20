import { Vector2 } from "three";
import { CommandType, InputType } from "../../lib/input";
import { Character } from "./base";

export const Rendy: Character = {
  name: "Rendy",
  maxHealth: 200,
  hurtbox: new Vector2(0.3, 0.65),
  sprite: {
    alphaMap: "assets/Tony.alpha.png",
    colorMap: "assets/Rendy.png",
    tileSize: new Vector2(36, 16),
  },
  abilities: [
    {
      clip: {
        loop: false,
        //@ts-ignore
        start: { right: 72, left: 36 * 3 - 1 },
        length: 1,
        get fps() {
          const la = Rendy.abilities[0];
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
      command: {
        type: CommandType.L,
        inputs: [InputType.LightAttack],
        priority: 1,
      },
    },
    {
      clip: {
        loop: false,
        start: 18 * 5 + 0,
        length: 6,
        fps: 1.85,
      },
      startup: 120,
      active: 40,
      recovery: 8,
      command: {
        type: CommandType.FL,
        inputs: [InputType.Forward, InputType.LightAttack],
        priority: 2,
      },
    },
  ],
};
