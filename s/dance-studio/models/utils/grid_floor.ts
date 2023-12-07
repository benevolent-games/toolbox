
import {Pipe} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Color3} from "@babylonjs/core/Maths/math.color.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"

import {loop2d} from "../../../tools/loopy.js"
import {Vec2, vec2} from "../../../tools/math/vec2.js"

export class GridFloor {
	material: PBRMaterial
	meshes = new Set<AbstractMesh>()

	constructor({scene, extent, scale, boxSize}: {
			scene: Scene
			extent: Vec2
			scale: number
			boxSize: number
		}) {

		const material = new PBRMaterial("mat", scene)
		material.albedoColor = new Color3(0.4, 0.4, 0.4)
		material.roughness = 0.5
		material.metallic = 0.5
		this.material = material

		const box = MeshBuilder.CreateBox("box", {size: boxSize}, scene)
		box.material = material
		box.setEnabled(false)
		this.meshes.add(box)

		let count = 1

		for (const vector of loop2d(extent)) {
			const instance = box.createInstance(`box_${count++}`)

			const offset = Pipe.with(extent)
				.to(v => vec2.addBy(v, -1))
				.to(v => vec2.divideBy(v, 2))
				.done()

			const [x, z] = Pipe.with(vector)
				.to(v => vec2.subtract(v, offset))
				.to(v => vec2.multiplyBy(v, scale))
				.done()

			instance.position = new Vector3(x, -(boxSize / 2), z)
			this.meshes.add(instance)
		}
	}
}

