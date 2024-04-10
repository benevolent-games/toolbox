
import {Quat} from "./quat.js"
import {Vec3} from "./vec3.js"
import {Node} from "@babylonjs/core/node.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"

import {nquery} from "../tools/nametag/nquery.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

export type Meshoid = Mesh | InstancedMesh
export type Prop = TransformNode | Meshoid

/** utilities for working with babylon objects. */
export const babylonian = {

	/** check the nametag of a babylon node or its material. */
	nquery,

	/** check what type of babylon node you'd dealing with. */
	is: {
		prop: (node: Node): node is Prop => (
			node instanceof TransformNode
		),
		meshoid: (node: Node): node is Meshoid => (
			node instanceof InstancedMesh ||
			node instanceof Mesh
		),
	},

	/** convert to toolbox maths. */
	to: {
		vec3: ({x, y, z}: Vector3): Vec3 => [x, y, z],
		quat: ({x, y, z, w}: Quaternion): Quat => [x, y, z, w],
	},

	/** convert to babylon maths. */
	from: {
		vec3: (v: Vec3) => new Vector3(...v),
		quat: (q: Quat) => new Quaternion(...q),
	},

	/** obtain a toolbox quat from a babylon transform node. */
	ascertain: {
		absoluteQuat: (transform: TransformNode) => {
			return babylonian.to.quat(transform.absoluteRotationQuaternion ?? (
				Quaternion.RotationYawPitchRoll(
					transform.rotation.y,
					transform.rotation.x,
					transform.rotation.z,
				)
			))
		},
		quat: (transform: TransformNode) => {
			return babylonian.to.quat(transform.rotationQuaternion ?? (
				Quaternion.RotationYawPitchRoll(
					transform.rotation.y,
					transform.rotation.x,
					transform.rotation.z,
				)
			))
		},
	},
}

