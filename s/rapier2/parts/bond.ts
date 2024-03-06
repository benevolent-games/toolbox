
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {Rapier} from "../rapier.js"
import {Quat, Vec3, quat, vec3} from "../../math/exports.js"
import {assert_babylon_quaternion} from "../../tools/assert_babylon_quaternion.js"

/** a synchronized partnership between a rapier object and a babylon object. */
export class PhysicsBond {
	constructor(

			/** rapier rigidbody or collider */
			public readonly actor: Rapier.RigidBody | Rapier.Collider,

			/** babylon mesh or otherwise */
			public readonly mimic: TransformNode,

			/** remove this bond (does nothing to the actor or mimic, just the bond itself) */
			public readonly dispose: () => void,
		) {

		this.move_babylon_mimic_to_rapier_coordinates()
	}

	get position() { return vec3.from.xyz(this.actor.translation()) }
	set position(v: Vec3) {
		this.actor.setTranslation(vec3.to.xyz(v), true)
		this.mimic.position.set(...v)
	}

	get rotation() { return quat.from.xyzw(this.actor.rotation()) }
	set rotation(q: Quat) {
		this.actor.setRotation(quat.to.xyzw(q), true)
		assert_babylon_quaternion(this.mimic).set(...q)
	}

	move_babylon_mimic_to_rapier_coordinates() {
		this.mimic.position
			.set(...vec3.from.xyz(this.actor.translation()))
		assert_babylon_quaternion(this.mimic)
			.set(...quat.from.xyzw(this.actor.rotation()))
	}
}

