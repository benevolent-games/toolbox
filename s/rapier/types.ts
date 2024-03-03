
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"

import {Rapier} from "./rapier.js"
import {Vec3} from "../math/vec3.js"
import {Quat} from "../math/quat.js"
import {Meshoid} from "../babyloid/types.js"
import {DebugColors, debug_colors} from "../tools/debug_colors.js"

export namespace Phys {
	export type Options = {
		hz: number
		scene: Scene
		gravity: Vec3
		colors: DebugColors
		contact_force_threshold: number
	}

	export type Context = {
		scene: Scene
		world: Rapier.World
		physicals: Set<Actor>
		colors: ReturnType<typeof debug_colors>
		contact_force_threshold: number
	}

	export type ActorDesc = {
		rigid: Rapier.RigidBodyDesc
		collider: Rapier.ColliderDesc
	}

	export type Actor = {
		readonly rigid: Rapier.RigidBody
		readonly collider: Rapier.Collider
		readonly position: Vector3
		readonly rotation: Quaternion
		dispose: () => void
	}

	export type Joint = {
		readonly joint: Rapier.ImpulseJoint
		dispose: () => void
	}

	export type BoxSpec = {
		scale: Vec3
		density: number
		linearDamping: number
		angularDamping: number
		groups?: number
		position?: Vec3
		rotation?: Quat
		material?: Material
	}

	export type BoxActor = {
		mesh: Mesh
	} & Actor

	export type CharacterActor = {
		mesh: Mesh,
		applyMovement: (velocity: Vec3) => {
			movement: Vec3
			grounded: boolean
		}
	} & Actor

	export type TrimeshActor = {
		meshoid: Meshoid
	} & Actor
}

