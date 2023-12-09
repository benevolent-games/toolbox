
import {Scene} from "@babylonjs/core/scene.js"
import {Op, Pojo, signals, is} from "@benev/slate"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {process_animation_groups} from "./utils/process_animation_groups.js"

export type Glb = {
	container: AssetContainer
	filename: string
	filesize: number
	anims: Pojo<AnimationGroup>
	activeAnims: Partial<ActiveAnims>
}

export type ActiveAnims = {
	tpose: AnimationGroup
	runningbackwards: AnimationGroup
	legs_strafeleft: AnimationGroup
	legs_straferight: AnimationGroup
	legs_running: AnimationGroup
	arms_running: AnimationGroup
}

function activate_animations(
		anims: Pojo<AnimationGroup>,
		ordering: [keyof ActiveAnims, number | null][],
	) {

	const activeAnims = {} as Partial<ActiveAnims>

	ordering.forEach(([key, weight], index) => {
		const anim = anims[key]
		if (anim) {
			anim.playOrder = index
			if (is.defined(weight))
				anim.weight = weight
			anim.start(true, 1)
			activeAnims[key] = anim
		}
		else
			activeAnims[key] = undefined
	})

	return activeAnims
}

export class Loader {
	#scene: Scene
	readonly glb = signals.op<Glb | null>(Op.ready(null))

	constructor(scene: Scene) {
		this.#scene = scene
	}

	unload_glb() {
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

		const anims = process_animation_groups(container.animationGroups)

		return {
			container,
			filename: file.name,
			filesize: file.size,
			anims,
			activeAnims: activate_animations(anims, [
				["tpose", null],
				["runningbackwards", 0],
				["legs_strafeleft", 0],
				["legs_straferight", 0],
				["legs_running", 0],
				["arms_running", 0],
			])
		}
	}

	async ingest(file: File) {
		if (this.glb.isLoading())
			return

		this.unload_glb()
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

