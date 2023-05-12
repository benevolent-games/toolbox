import {V2} from "../../utils/v2.js"
import {V3} from "../../utils/v3.js"
import {Context} from "./context.js"
import {Component} from "../classes/component.js"

export class FlyCamera extends Component<Context, FlyCameraState> {

  constructor(
      context: Context,
      state: FlyCameraState = fly_camera_default_state(),
    ) {
    super(context, state)
  }

  async spawn() {}
  async despawn() {}
}

export type Speeds = {
	base: number
	fast: number
	slow: number
}

export type FlyCameraSettings = {
	speeds_for_movement: Speeds
	speeds_for_looking_with_keys_and_stick: Speeds
	pointer: {
		effect: string,
		cause_to_use_when_pointer_not_locked: string,
	}
	look_sensitivity: {
		stick: number
		pointer: number
	}
}

export type FlyCameraState = FlyCameraSettings & {
  position: V3
  swivel: V2
}

export const fly_camera_default_state = (): FlyCameraState => ({
  position: [0, 0, 0],
  swivel: [0, 0],
  pointer: {
    effect: "look",
    cause_to_use_when_pointer_not_locked: "Lookpad",
  },
  speeds_for_movement: {
    slow: 1 / 25,
    base: 1 / 5,
    fast: 1,
  },
  speeds_for_looking_with_keys_and_stick: {
    slow: 1 / 200,
    base: 1 / 25,
    fast: 1 / 5,
  },
  look_sensitivity: {
    stick: 1 / 100,
    pointer: 1 / 200,
  },
})
