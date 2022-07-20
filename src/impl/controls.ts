import { FGCharacter } from "../lib/character";
import { ActionMap, InputType } from "../lib/input";

export const P1Controls: ActionMap = {
  Left: {
    key: "a",
    triggered: false,
    held: false,
    process: function (character: FGCharacter) {
      if (!this.data) this.data = {};

      this.data.direction = character.facingRight
        ? InputType.Back
        : InputType.Forward;
    },
  },
  Right: {
    key: "d",
    triggered: false,
    held: false,
    process: function (character: FGCharacter) {
      if (!this.data) this.data = {};

      this.data.direction = character.facingRight
        ? InputType.Forward
        : InputType.Back;
    },
  },
  LightAttack: {
    key: "s",
    triggered: false,
    held: false,
  },
  Start: {
    key: "q",
    triggered: false,
    held: false,
  },
};

export const P2Controls: ActionMap = {
  Left: {
    key: "ArrowLeft",
    triggered: false,
    held: false,
    process: function (character: FGCharacter) {
      if (!this.data) this.data = {};

      this.data.direction = character.facingRight
        ? InputType.Back
        : InputType.Forward;
    },
  },
  Right: {
    key: "ArrowRight",
    triggered: false,
    held: false,
    process: function (character: FGCharacter) {
      if (!this.data) this.data = {};

      this.data.direction = character.facingRight
        ? InputType.Forward
        : InputType.Back;
    },
  },
  LightAttack: {
    key: "ArrowDown",
    triggered: false,
    held: false,
  },
  Start: {
    key: "Enter",
    triggered: false,
    held: false,
  },
};
