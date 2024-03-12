
import {Scene} from "@babylonjs/core/scene.js"
import {Material} from "@babylonjs/core/Materials/material.js"

import {Rapier} from "../rapier.js"
import {Quat} from "../../math/quat.js"
import {Vec3} from "../../math/vec3.js"
import {DebugColors} from "../../tools/debug_colors.js"

export type PhysicsOptions = {
	scene: Scene
	gravity: Vec3
	hertz: number
	colors?: DebugColors
}

export type Actor = Rapier.RigidBody | Rapier.Collider

export type ColliderOptions = {
	groups: number
	material: Material | null
	contact_force_threshold: number
}

export type Transform = {
	position: Vec3
	rotation: Quat
}

