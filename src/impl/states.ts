import { FGCharacter, State } from "../lib/character";
import { f32 } from "../lib/types";
import { idle, punch, walk, walkBack } from "./clips";

export class IdleState implements State {
  public enter(character: FGCharacter) {
    character.play(idle);
  }

  public exit() {}

  public handle(character: FGCharacter): State | null {
    if (character.actionMap.LightAttack.triggered) return new PunchState();
    if (character.actionMap.Left.held) return new WalkBackState();
    if (character.actionMap.Right.held) return new WalkState();

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

export class WalkState implements State {
  public enter(character: FGCharacter) {
    character.play(walk);
  }

  public exit() {}

  public handle(character: FGCharacter): State | null {
    if (character.actionMap.LightAttack.triggered) return new PunchState();
    if (character.actionMap.Left.held) return new WalkBackState();
    if (character.actionMap.Right.held) return null;

    return new IdleState();
  }

  public update(dt: f32, character: FGCharacter) {
    character.sprite.position.x += 0.25 * dt;
  }
}

export class WalkBackState implements State {
  public enter(character: FGCharacter) {
    character.play(walkBack);
  }

  public exit() {}

  public handle(character: FGCharacter): State | null {
    if (character.actionMap.LightAttack.triggered) return new PunchState();
    if (character.actionMap.Left.held) return null;
    if (character.actionMap.Right.held) return new WalkState();

    return new IdleState();
  }

  public update(dt: f32, character: FGCharacter) {
    character.sprite.position.x -= 0.25 * dt;
  }
}
