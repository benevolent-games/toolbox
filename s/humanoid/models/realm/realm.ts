
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {make_realm} from "./make.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {Plate} from "../../../common/models/plate/plate.js"
import {Porthole} from "../../../common/models/porthole/porthole.js"
import {PlatePhysics} from "../../../common/models/plate/setup_physics.js"
import {CharacterContainer} from "../../../dance-studio/models/loader/character/container.js"

export type RealmContainers = {
	gym: AssetContainer
	character: CharacterContainer
}

export type RealmParams = {
	porthole: Porthole
	plate: Plate
	physics: PlatePhysics
	containers: RealmContainers
}

export class Realm {
	static make = make_realm

	#params: RealmParams
	#impulse: HumanoidImpulse

	get porthole() { return this.#params.porthole }
	get plate() { return this.#params.plate }
	get physics() { return this.#params.physics }
	get containers() { return this.#params.containers }
	get impulse() { return this.#impulse }

	constructor(params: RealmParams) {
		this.#params = params
		this.#impulse = new HumanoidImpulse()
		params.plate.start()
	}
}

