
import {Realm} from "./realm.js"
import {Plate} from "../../../common/models/plate/plate.js"
import {Porthole} from "../../../common/models/porthole/porthole.js"

export async function make_realm({glb_links}: {
		glb_links: {
			gym: string
			character: string
		}
	}) {

	const porthole = new Porthole()
	const plate = new Plate(porthole.canvas)

	const [gym, character] = await Promise.all([
		plate.load_glb(glb_links.gym),
		plate.load_glb(glb_links.character),
	])

	for (const light of gym.lights)
		light.intensity /= 1000

	// gym.addAllToScene()

	return new Realm({
		porthole,
		plate,
		containers: {gym, character},
	})
}

