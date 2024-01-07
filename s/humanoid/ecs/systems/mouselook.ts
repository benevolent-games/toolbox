import { house } from "../house";

export const spectatorSystem = house.rezzer(
	["mouselook", "intent", "gimbal", "sensitivity"],
	({realm}) => (state, id) => {

	const {impulse} = realm
	const {intent, gimbal, sensitivity} = state

	return {
		update() {
			const [x, y] = impulse.devices.mouse.movement
		},
		dispose() {},
	}
})

