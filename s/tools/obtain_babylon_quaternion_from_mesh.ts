
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"

export function obtain_babylon_quaternion_from_mesh(mesh: AbstractMesh) {
	return mesh.rotationQuaternion ?? (
		mesh.rotationQuaternion = Quaternion.RotationYawPitchRoll(
			mesh.rotation.y,
			mesh.rotation.x,
			mesh.rotation.z,
		)
	)
}

