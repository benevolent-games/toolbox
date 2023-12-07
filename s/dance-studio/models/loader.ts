
import {Pojo, signals} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {human} from "../../tools/human.js"

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

		const anims: Pojo<AnimationGroup> = Object.fromEntries(
			container.animationGroups
				.map(anim => {
					anim.stop()
					anim.reset()
					return anim
				})
				.map(anim => [anim.name, anim])
		)

		console.log("anims", anims)

		anims.tpose.playOrder = 1
		anims.tpose.start(true)

		anims.lookupdown.playOrder = 2
		anims.lookupdown.start(true, 0.1)

		anims.strafeleft.playOrder = 3
		anims.strafeleft.weight = 1
		anims.strafeleft.start(true)

		anims.walking.playOrder = 4
		anims.strafeleft.weight = 1
		anims.walking.start(true)

		anims.wave.playOrder = 5
		anims.wave.start(true)
	}
}

