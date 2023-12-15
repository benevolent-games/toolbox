
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {make_realm} from "./make.js"
// import {Spectator} from "../spectator/spectator.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {Plate} from "../../../common/models/plate/plate.js"
import {Porthole} from "../../../common/models/porthole/porthole.js"

export type RealmParams = {
	porthole: Porthole
	plate: Plate
	containers: {
		gym: AssetContainer
		character: AssetContainer
	}
}

export class Realm {
	static make = make_realm

	#params: RealmParams
	#impulse: HumanoidImpulse

	get porthole() { return this.#params.porthole }
	get plate() { return this.#params.plate }
	get containers() { return this.#params.containers }
	get impulse() { return this.#impulse }

	constructor(params: RealmParams) {
		this.#params = params
		this.#impulse = new HumanoidImpulse()

		const {plate} = params
		// const spectator = new Spectator(plate, this.#impulse)
		// plate.setCamera(spectator.camera)

		plate.start()
	}
}

