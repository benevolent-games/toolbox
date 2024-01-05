
import {Rapier} from "./rapier.js"
import {Vec3} from "../tools/math/vec3.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"

export type Physical = {
	rigid: Rapier.RigidBody
	collider: Rapier.Collider
	position: Vector3
	rotation: Quaternion
	dispose: () => void
}

export type CharacterCapsule = {
	mesh: Mesh,
	dispose: () => void
	applyMovement: (velocity: Vec3) => {
		movement: Vec3
		grounded: boolean
	}
} & Physical

