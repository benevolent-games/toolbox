
import {Rapier} from "./rapier.js"
import {Vec3} from "../tools/math/vec3.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {debug_colors} from "../tools/debug_colors.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"

export type PhysicsOptions = {
	hz: number,
	scene: Scene,
	gravity: Vec3,
	contact_force_threshold?: number,
}

export type PhysContext = {
	scene: Scene
	world: Rapier.World
	label: (name: string) => string
	physicals: Set<Physical>
	colors: ReturnType<typeof debug_colors>
	contact_force_threshold: number
}

export type PhysicalDesc = {
	rigid: Rapier.RigidBodyDesc
	collider: Rapier.ColliderDesc
}

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

