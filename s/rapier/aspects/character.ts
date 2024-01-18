
import {Phys} from "../types.js"
import {Rapier} from "../rapier.js"
import {Vec3, vec3} from "../../tools/math/vec3.js"
import {gravitation} from "../parts/gravitation.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

export interface CharacterSpec {
	mass: number
	radius: number
	halfHeight: number
	slopes: {
		maxClimbAngle: number
		minSlideAngle: number
	}
	autostep: null | {
		maxHeight: number
		minWidth: number
		includeDynamicBodies: boolean
	}
	snapToGround: null | {
		distance: number
	}
}

export function create_character_controller(
		{world}: Phys.Context,
		spec: CharacterSpec,
	) {

	const controller = world.createCharacterController(0.02)
	controller.setSlideEnabled(true)
	controller.setApplyImpulsesToDynamicBodies(true)
	controller.setMaxSlopeClimbAngle(spec.slopes.maxClimbAngle)
	controller.setMinSlopeSlideAngle(spec.slopes.minSlideAngle)

	if (spec.autostep)
		controller.enableAutostep(
			spec.autostep.maxHeight,
			spec.autostep.minWidth,
			spec.autostep.includeDynamicBodies,
		)

	if (spec.snapToGround)
		controller.enableSnapToGround(spec.snapToGround.distance)

	return controller
}

export function character_desc(
		context: Phys.Context,
		spec: CharacterSpec,
	): Phys.ActorDesc {
	return {
		rigid: Rapier.RigidBodyDesc
			.kinematicPositionBased(),

		collider: Rapier.ColliderDesc
			.capsule(spec.halfHeight, spec.radius)
			.setMass(spec.mass)
			.setContactForceEventThreshold(context.contact_force_threshold)
			.setActiveEvents(
				Rapier.ActiveEvents.COLLISION_EVENTS |
				Rapier.ActiveEvents.CONTACT_FORCE_EVENTS
			),
	}
}

export function create_babylon_mesh_for_character(
		{scene, label, colors}: Phys.Context,
		spec: CharacterSpec,
		actor: Phys.Actor,
		material: Material = colors.cyan,
	) {

	const mesh = MeshBuilder.CreateCapsule(
		label("capsule"),
		{radius: spec.radius, height: 2 * (spec.halfHeight + spec.radius)},
		scene,
	)

	mesh.position = actor.position
	mesh.rotationQuaternion = actor.rotation
	mesh.material = material

	return mesh
}

export function make_apply_movement_fn(
		world: Rapier.World,
		controller: Rapier.KinematicCharacterController,
		actor: Phys.Actor,
	) {

	return (velocity: Vec3) => {
		const velocity_with_gravity = vec3.add(
			velocity,
			gravitation(world),
		)

		controller.computeColliderMovement(
			actor.collider,
			vec3.to.xyz(velocity_with_gravity),
		)

		const originalPosition = vec3.from.xyz(actor.rigid.translation())
		const grounded = controller.computedGrounded()
		const movement = vec3.from.xyz(controller.computedMovement())
		const newPosition = vec3.add(originalPosition, movement)

		actor.rigid.setNextKinematicTranslation(vec3.to.xyz(newPosition))

		return {
			grounded,
			movement,
		}
	}
}

