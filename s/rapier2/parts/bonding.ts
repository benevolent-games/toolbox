
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {Rapier} from "../rapier.js"
import {PhysicsBond} from "./bond.js"

export class PhysicsBonding {
	#bonds = new Set<PhysicsBond>

	bond(actor: Rapier.RigidBody | Rapier.Collider, mimic: TransformNode, dispose: () => void) {
		const bond = new PhysicsBond(actor, mimic, () => {
			this.#bonds.delete(bond)
			dispose()
		})
		this.#bonds.add(bond)
		return bond
	}

	synchronize() {
		for (const bond of this.#bonds)
			bond.move_babylon_mimic_to_rapier_coordinates()
	}
}

