
import {signals} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"

import {human} from "../../tools/human.js"
import {process_animation_groups} from "./utils/process_animation_groups.js"

export class Loader {
	#scene: Scene
	readonly container = signals.signal<AssetContainer | null>(null)

	constructor(scene: Scene) {
		this.#scene = scene
	}

	async ingest(file: File) {
		const container = await SceneLoader.LoadAssetContainerAsync(
			URL.createObjectURL(file),
			undefined,
			this.#scene,
			() => {},
			".glb",
		)
		console.log(file.name, human.megabytes(file.size))
		console.log(container)
		container.addAllToScene()
		this.container.value = container

		const anims = process_animation_groups(container.animationGroups)
		console.log("anims", anims)
		console.log(Object.keys(anims))

		anims.tpose.playOrder = 1
		anims.tpose.start(true)

		anims.spine.playOrder = 2
		anims.spine.start(true, 1)

		anims.legs_strafeleft.playOrder = 3
		anims.legs_strafeleft.weight = 1
		anims.legs_strafeleft.start(true)

		anims.legs_running.playOrder = 4
		anims.legs_running.weight = 1
		anims.legs_running.start(true, 1)

		anims.arms_running.playOrder = 5
		anims.arms_running.weight = 1
		anims.arms_running.start(true)

		anims.arms_wave.playOrder = 6
		anims.arms_wave.weight = 1
		anims.arms_wave.start(true)
	}
}

