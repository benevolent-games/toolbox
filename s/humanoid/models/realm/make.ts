

import {Realm} from "./realm.js"
import {Plate} from "../../../common/models/plate/plate.js"
import {Porthole} from "../../../common/models/porthole/porthole.js"
import {setup_physics} from "../../../common/models/plate/setup_physics.js"
import {CharacterContainer} from "../../../dance-studio/models/loader/character/container.js"

export async function make_realm({glb_links}: {
		glb_links: {
			gym: string
			character: string
		}
	}) {

	const porthole = new Porthole()
	const plate = new Plate(porthole.canvas)
	const physics = await setup_physics(plate.scene)

	const [gym, character] = await Promise.all([
		plate.load_glb(glb_links.gym),
		plate.load_glb(glb_links.character)
			.then(container => new CharacterContainer(container)),
	])

	for (const light of gym.lights)
		light.intensity /= 1000

	return new Realm({
		porthole,
		plate,
		physics,
		containers: {gym, character},
	})
}

