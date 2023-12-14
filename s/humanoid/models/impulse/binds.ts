
import {binds} from "../../../impulse/binds.js"

export type HumanoidBinds = ReturnType<typeof humanoid_binds>

export const humanoid_binds = () => binds(({
		mode, buttons, b, modless, ctrl, shift,
	}) => ({

	humanoid: mode({
		vectors: {
			mouselook: ["mouse"],
			sticklook: ["look"],
			move: ["leftstick"],
		},
		buttons: {
			forward: buttons(modless("KeyW")),
			backward: buttons(modless("KeyS")),
			leftward: buttons(modless("KeyA")),
			rightward: buttons(modless("KeyD")),

			crouch: buttons(modless("KeyC")),
			jump: buttons(modless("Space")),

			fast: buttons(modless("Shift")),
			slow: buttons(modless("Shift")),

			up: buttons(modless("KeyI")),
			down: buttons(modless("KeyK")),
			left: buttons(modless("KeyJ")),
			right: buttons(modless("KeyL")),
		},
	}),
}))

