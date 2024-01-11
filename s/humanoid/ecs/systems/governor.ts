
import {system} from "../house.js"

export const governor_system = system(realm => {
	realm.impulse.modes.assign("universal", "humanoid")

	let next: () => void = () => {}

	function spectatorState() {
		const id = realm.spawn.spectator({
			position: [0, 1, -2],
			sensitivity: {
				keys: 5 / 100,
				mouse: 10 / 100,
				stick: 10 / 100,
			},
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

