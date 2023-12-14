
import {vec2} from "../../../tools/math/vec2.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {Disposable} from "../../../tools/disposable.js"
import {Plate} from "../../../common/models/plate/plate.js"
import {Flycam} from "../../../common/models/flycam/flycam.js"
import {get_trajectory_from_cardinals} from "../../../impulse/trajectory/get_trajectory_from_cardinals.js"

export class Spectator extends Disposable {
	#flycam: Flycam

	get camera() {
		return this.#flycam.camera
	}

	constructor(plate: Plate, impulse: HumanoidImpulse) {
		super()

		this.#flycam = new Flycam({
			scene: plate.scene,
			position: [0, 1, 0],
		})

		this.disposable(plate.onTick(() => {
			const {buttons} = impulse.report.humanoid

			const move = get_trajectory_from_cardinals({
				north: buttons.forward,
				south: buttons.backward,
				east: buttons.rightward,
				west: buttons.leftward,
			})

			const look = get_trajectory_from_cardinals({
				north: buttons.up,
				south: buttons.down,
				east: buttons.right,
				west: buttons.left,
			})

			this.#flycam.add_move(vec2.multiplyBy(move, 1 / 10))
			this.#flycam.add_look(vec2.multiplyBy(look, 1 / 100))
		}))
	}

}

