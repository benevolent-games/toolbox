
import {Rapier} from "../rapier.js"
import {Physical} from "../types.js"
import {gravitation} from "./gravitation.js"
import {Vec3, vec3} from "../../tools/math/vec3.js"

export function make_apply_movement_fn(
		world: Rapier.World,
		controller: Rapier.KinematicCharacterController,
		physical: Physical,
	) {

	return (velocity: Vec3) => {
		const velocity_with_gravity = vec3.add(
			velocity,
			gravitation(world),
		)

		controller.computeColliderMovement(
			physical.collider,
			vec3.to.xyz(velocity_with_gravity),
		)

		const originalPosition = vec3.from.xyz(physical.rigid.translation())
		const grounded = controller.computedGrounded()
		const movement = vec3.from.xyz(controller.computedMovement())
		const newPosition = vec3.add(originalPosition, movement)

		physical.rigid.setNextKinematicTranslation(vec3.to.xyz(newPosition))

		return {
			grounded,
			movement,
		}
	}
}

