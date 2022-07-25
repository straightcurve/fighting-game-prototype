import { AnimationClip } from "../lib/animation";

export const idle: AnimationClip = {
  loop: true,
  start: 8,
  length: 3,
  fps: 3,
};

export const idleLeft: AnimationClip = {
  loop: true,
  start: 36 - 8 - 3,
  length: 3,
  fps: 3,
};

export const walk: AnimationClip = {
  loop: true,
  start: 37,
  length: 1,
  fps: 1,
};

export const walkLeft: AnimationClip = {
  loop: true,
  start: 72 - 1 - 1,
  length: 1,
  fps: 1,
};

export const walkBack: AnimationClip = {
  loop: false,
  start: 36,
  length: 1,
  fps: 1,
};

export const walkBackLeft: AnimationClip = {
  loop: false,
  start: 72 - 1,
  length: 1,
  fps: 1,
};

export const die: AnimationClip = {
  loop: false,
  start: 36 * 3 + 7,
  length: 1,
  fps: 1,
};

export const dieLeft: AnimationClip = {
  loop: false,
  start: 36 * 4 - 7 - 1,
  length: 1,
  fps: 1,
};

export const block: AnimationClip = {
  loop: false,
  start: 36 * 3,
  length: 1,
  fps: 1,
};

export const blockLeft: AnimationClip = {
  loop: false,
  start: 36 * 4 - 1,
  length: 1,
  fps: 1,
};

export const hit: AnimationClip = {
  loop: false,
  start: 36 * 3 + 3,
  length: 1,
  fps: 1,
};

export const hitLeft: AnimationClip = {
  loop: false,
  start: 36 * 4 - 4,
  length: 1,
  fps: 1,
};
