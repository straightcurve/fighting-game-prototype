import { ActionMap } from "../lib/input";

export const P1Controls: ActionMap = {
  Left: {
    key: "a",
    triggered: false,
    held: false,
  },
  Right: {
    key: "d",
    triggered: false,
    held: false,
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
  },
  Right: {
    key: "ArrowRight",
    triggered: false,
    held: false,
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
