import { Clock } from "../src/lib/clock";
import { dt } from "../src/lib/time";
import { f32 } from "../src/lib/types";

export class TestClock implements Clock {
  public d: f32 = dt;

  public delta(v: f32) {
    this.d = v;
    return this;
  }

  public getDelta(): f32 {
    return this.d;
  }
}
