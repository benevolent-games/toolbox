
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {Rapier} from "../../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Vec3} from "../../../math/vec3.js"
import {label} from "../../../tools/label.js"
import {ColliderOptions} from "../utils/types.js"
import {Trashcan} from "../../../tools/trashcan.js"
import {Quat, vec3} from "../../../math/exports.js"
import {babylonian} from "../../../math/babylonian.js"
import {applyMaterial} from "../utils/apply_material.js"

export const characterCapsule = prefab(physics => (o: {
		position: Vec3
		rotation: Quat
		offset: number
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
	} & ColliderOptions) => {

	const {bag, dispose} = new Trashcan()

	const collider = bag(
		physics.world.createCollider(
			Rapier.ColliderDesc
				.capsule(o.halfHeight, o.radius)
				.setMass(o.mass)
				.setContactForceEventThreshold(o.contact_force_threshold)
				.setCollisionGroups(o.groups)
				.setActiveEvents(
					Rapier.ActiveEvents.COLLISION_EVENTS |
					Rapier.ActiveEvents.CONTACT_FORCE_EVENTS
				)
		)
	).dump(c => physics.world.removeCollider(c, false))

	const mesh = bag(
		MeshBuilder.CreateCapsule(
			label("capsule"),
			{radius: o.radius, height: 2 * (o.halfHeight + o.radius)},
			physics.scene,
		)
	).dump(m => m.dispose())
	mesh.position = babylonian.from.vec3(o.position)
	mesh.rotationQuaternion = babylonian.from.quat(o.rotation)
	applyMaterial(mesh, o.material)

	const rigid = bag(
		physics.world.createRigidBody(
			Rapier.RigidBodyDesc.kinematicPositionBased()
		)
	).dump(r => physics.world.removeRigidBody(r))

	const controller = bag((() => {
		const c = physics.world.createCharacterController(o.offset)
		c.setSlideEnabled(true)
		c.setApplyImpulsesToDynamicBodies(true)
		c.setMaxSlopeClimbAngle(o.slopes.maxClimbAngle)
		c.setMinSlopeSlideAngle(o.slopes.minSlideAngle)
		if (o.autostep)
			c.enableAutostep(
				o.autostep.maxHeight,
				o.autostep.minWidth,
				o.autostep.includeDynamicBodies,
			)
		if (o.snapToGround)
			c.enableSnapToGround(o.snapToGround.distance)
		return c
	})()).dump(c => physics.world.removeCharacterController(c))

	const bond = bag(physics.bonding.create(rigid, mesh))
		.dump(b => physics.bonding.remove(b))

	function applyMovement(velocity: Vec3) {
		controller.computeColliderMovement(
			collider,
			vec3.to.xyz(velocity),
		)
		const originalPosition = vec3.from.xyz(rigid.translation())
		const grounded = controller.computedGrounded()
		const movement = vec3.from.xyz(controller.computedMovement())
		const newPosition = vec3.add(originalPosition, movement)
		rigid.setNextKinematicTranslation(vec3.to.xyz(newPosition))
		return {grounded, movement}
	}

	return {
		bond,
		mesh,
		rigid,
		dispose,
		collider,
		controller,
		applyMovement,
	}
})

