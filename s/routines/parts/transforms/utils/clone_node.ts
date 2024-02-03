
import {Document, Node} from "@gltf-transform/core"

import {Counter} from "./counter.js"
import {clone_mesh} from "./clone_mesh.js"

export function clone_node(
		document: Document,
		counter: Counter,
		node: Node,
		new_name: string,
	) {

	const scene = document.getRoot().getDefaultScene()

	if (!scene)
		throw new Error("glb doesn't have a default scene")

	const newNode = document.createNode(new_name)
		.setTranslation(node.getTranslation())
		.setRotation(node.getRotation())
		.setScale(node.getScale())

	const mesh = node.getMesh()

	if (mesh)
		newNode.setMesh(
			clone_mesh(
				document,
				mesh,
				`${mesh.getName()}+${counter.count}`
			)
		)

	scene.addChild(newNode)
	return newNode
}

