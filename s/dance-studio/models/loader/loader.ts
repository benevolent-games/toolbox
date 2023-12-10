
import {Op, signals} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"

import {Glb} from "./utils/types.js"
import {Choreographer} from "./choreographer/choreographer.js"

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

	async ingest(file: File) {
		if (this.glb.isLoading())
			return

		this.unload_glb()
		await this.glb.run(() => this.#load_glb_asset_container(file))
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
			choreographer: new Choreographer(container.animationGroups),
		}
	}
}

