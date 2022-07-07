import { AnimationClip } from "../lib/animation";

export const idle: AnimationClip = {
  loop: true,
  start: 8,
  length: 3,
  fps: 3,
};

export const punch: AnimationClip = {
  loop: false,
  start: 36,
  length: 2,
  fps: 1.35,
};

export const walk: AnimationClip = {
  loop: true,
  start: 19,
  length: 1,
  fps: 1,
};

export const walkBack: AnimationClip = {
  loop: false,
  start: 18,
  length: 1,
  fps: 1,
};
