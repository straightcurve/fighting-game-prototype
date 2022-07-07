import { FGCharacter, State } from "../lib/character";
import { f32 } from "../lib/types";
import { idle, punch } from "./clips";

export class IdleState implements State {
  public enter(character: FGCharacter) {
    character.play(idle);
  }

  public exit() {}

  public handle(character: FGCharacter): State | null {
    if (character.actionMap.LightAttack.triggered) return new PunchState();

    return null;
  }

  public update(_dt: f32, _character: FGCharacter) {}
}

export class PunchState implements State {
  public enter(character: FGCharacter) {
    character.play(punch);
  }

  public exit(_character: FGCharacter) {}

  public handle(character: FGCharacter): State | null {
    const animator = character.animator;
    const clip = animator.clip;

    if (clip && animator.frame == clip.start + clip.length - 1)
      return new IdleState();

    return null;
  }

  public update(_dt: f32, _character: FGCharacter) {}
}
