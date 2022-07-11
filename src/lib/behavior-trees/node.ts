export enum NodeState {
  Running,
  Success,
  Failure,
}

export abstract class Node {
  public parent: Node | null;

  protected state: NodeState;
  protected children: Node[];

  private context: { [key: string]: any } = {};

  constructor(children: Node[] = []) {
    this.parent = null;
    this.state = NodeState.Running;
    this.children = [];

    children.forEach((c) => this.attach(c));
  }

  public attach(to: Node) {
    to.parent = this;
    this.children.push(to);
  }

  public abstract evaluate(): NodeState;

  public setData(key: string, value: any) {
    this.context[key] = value;
  }

  public getData<T>(key: string): T | null {
    let value = this.context[key];
    if (value !== undefined) return value;

    let current: Node = this;
    while (current.parent) {
      current = current.parent;
      value = current.getData(key);
      if (value !== undefined) return value;
    }

    return null;
  }

  public clearData(key: string): boolean {
    if (this.context[key] !== undefined) {
      delete this.context[key];
      return true;
    }

    let current: Node = this;
    while (current.parent) {
      current = current.parent;
      if (current.clearData(key)) return true;
    }

    return false;
  }
}
