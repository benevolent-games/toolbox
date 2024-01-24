
import {Meshoid, Prop} from "./types.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

export function prop_is_meshoid(prop: Prop): prop is Meshoid {
	return !!(
		prop instanceof Mesh ||
		prop instanceof InstancedMesh
	)
}

