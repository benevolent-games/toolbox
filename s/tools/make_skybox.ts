
import {Scene} from "@babylonjs/core/scene.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

import {CommitHash} from "./commit_hash.js"

export type SkyboxLinks = {
	px: string
	py: string
	pz: string
	nx: string
	ny: string
	nz: string
}

export type SkyboxParams = {
	yaw: number
	size: number
	height: number
}

export function skybox_image_links(directory: string, extension: string): SkyboxLinks {
	return {
		px: `${directory}/px${extension}`,
		py: `${directory}/py${extension}`,
		pz: `${directory}/pz${extension}`,
		nx: `${directory}/nx${extension}`,
		ny: `${directory}/ny${extension}`,
		nz: `${directory}/nz${extension}`,
	}
}

export function make_skybox({
			scene,
			yaw,
			size,
			links,
			commit,
			height,
		}: {
		scene: Scene
		commit?: CommitHash
		links: SkyboxLinks
	} & SkyboxParams) {

	const processUrl = commit
		? (url: string) => commit.augment(url)
		: (url: string) => url

	const box = MeshBuilder.CreateBox("skyBox", {size}, scene)
	box.position = new Vector3(0, height, 0)
	box.infiniteDistance = true
	box.rotationQuaternion = (
		Quaternion.RotationYawPitchRoll(yaw, 0, 0)
	)

	const texture = (() => {
		const extensions = ["", "", "", "", "", ""]
		const noMipmap = false
		const files = [
			links.px,
			links.py,
			links.pz,
			links.nx,
			links.ny,
			links.nz,
		]
		return new CubeTexture(
			"",
			scene,
			extensions,
			noMipmap,
			files.map(processUrl),
		)
	})()

	texture.coordinatesMode = Texture.SKYBOX_MODE

	const material = new StandardMaterial("skybox", scene)
	material.disableLighting = true
	material.backFaceCulling = false
	material.reflectionTexture = texture

	box.material = material

	return {
		box,
		material,
		texture,
		dispose() {
			texture.dispose()
			material.dispose()
			box.dispose()
		},
	}
}

