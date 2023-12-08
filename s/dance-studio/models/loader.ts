
import {Op, Pojo, signals} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {process_animation_groups} from "./utils/process_animation_groups.js"

export type Glb = {
	container: AssetContainer
	filename: string
	filesize: number
	anims: Pojo<AnimationGroup>
}

export class Loader {
	#scene: Scene
	readonly glb = signals.op<Glb | null>(Op.ready(null))

	constructor(scene: Scene) {
		this.#scene = scene
	}

	#delete_existing_glb() {
		const glb = this.glb.payload
		if (glb) {
			glb.container.removeAllFromScene()
			glb.container.dispose()
			this.glb.setReady(null)
		}
	}

	async #load_glb_asset_container(file: File): Promise<Glb> {
		const container = await SceneLoader.LoadAssetContainerAsync(
			URL.createObjectURL(file),
			undefined,
			this.#scene,
			() => {},
			".glb",
		)

		container.addAllToScene()

		return {
			container,
			filename: file.name,
			filesize: file.size,
			anims: process_animation_groups(container.animationGroups)
		}
	}

	async ingest(file: File) {
		if (this.glb.isLoading())
			return

		this.#delete_existing_glb()
		await this.glb.run(() => this.#load_glb_asset_container(file))

		// console.log("anims", anims)
		// console.log(Object.keys(anims))

		// anims.tpose.playOrder = 1
		// anims.tpose.start(true)

		// anims.spine.playOrder = 2
		// anims.spine.start(true, 1)

		// anims.legs_strafeleft.playOrder = 3
		// anims.legs_strafeleft.weight = 1
		// anims.legs_strafeleft.start(true)

		// anims.legs_running.playOrder = 4
		// anims.legs_running.weight = 1
		// anims.legs_running.start(true, 1)

		// anims.arms_running.playOrder = 5
		// anims.arms_running.weight = 1
		// anims.arms_running.start(true)

		// anims.arms_wave.playOrder = 6
		// anims.arms_wave.weight = 1
		// anims.arms_wave.start(true)
	}
}

