
import {Rapier} from "./rapier.js"
import {Vec3} from "../tools/math/vec3.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {DebugColors, debug_colors} from "../tools/debug_colors.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"

export type PhysicsOptions = {
	hz: number
	scene: Scene
	gravity: Vec3
	colors?: DebugColors
	contact_force_threshold?: number
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
	readonly rigid: Rapier.RigidBody
	readonly collider: Rapier.Collider
	readonly position: Vector3
	readonly rotation: Quaternion
	dispose: () => void
}

export type Joint = {
	dispose: () => void
}

export type PhysicalBox = {
	mesh: Mesh
} & Physical

export type PhysicalCharacterCapsule = {
	mesh: Mesh,
	applyMovement: (velocity: Vec3) => {
		movement: Vec3
		grounded: boolean
	}
} & Physical

