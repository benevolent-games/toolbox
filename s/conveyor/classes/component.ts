import {ContextBase} from "../types/context_base.js"

export abstract class Component<
    xContext extends ContextBase,
    xState extends {},
  > {

  constructor(
    public readonly context: xContext,
    public readonly state: xState,
  ) {}

  async spawn() {}
  async despawn() {}
}
