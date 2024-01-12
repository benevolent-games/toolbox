
import {system} from "../house.js"
import {Sensitivity} from "../../models/impulse/types.js"

export const governor_system = system(realm => {
	realm.impulse.modes.assign("universal", "humanoid")

	const sensitivity = (): Sensitivity => ({
		keys: 10 / 1000,
		mouse: 5 / 1000,
		stick: 10 / 1000,
	})

	let next: () => void = () => {}

	function spectatorState() {
		const id = realm.spawn.spectator({
			position: [0, 1, -2],
			sensitivity: sensitivity(),
		})
		next = () => {
			realm.entities.delete(id)
			humanoidState()
		}
	}

	function humanoidState() {
		const id = realm.spawn.humanoid({
			debug: true,
			position: [0, 5, 0],
			sensitivity: sensitivity(),
		})
		next = () => {
			realm.entities.delete(id)
			spectatorState()
		}
	}

	humanoidState()

	realm.impulse.on.universal.buttons.respawn(input => {
		if (input.down)
			next()
	})

	return tick => {}
})

