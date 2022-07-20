import { f32, i32 } from "./types";

export let dt: f32 = 1 / 60;
export let frame: i32 = 0;

export function nextFrame() {
  frame++;
}
