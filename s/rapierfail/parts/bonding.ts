
import {Bond} from "./utils/bond.js"
import {Actor} from "./utils/types.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export class PhysicsBonding {
	#bonds = new Set<Bond>

	create<A extends Actor, M extends TransformNode>(actor: A, mimic: M) {
		return this.add(new Bond(actor, mimic))
	}

	add<B extends Bond>(bond: B) {
		this.#bonds.add(bond)
		return bond
	}

	remove(bond: Bond) {
		this.#bonds.delete(bond)
	}

	synchronize() {
		for (const bond of this.#bonds)
			bond.move_babylon_mimic_to_rapier_coordinates()
	}
}

