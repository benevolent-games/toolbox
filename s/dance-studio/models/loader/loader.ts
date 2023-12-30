
import {Op, signals} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"

import {nap} from "../../../tools/nap.js"
import {download} from "./utils/download.js"
import {fileData} from "./utils/file_data.js"
import {FileData, Glb} from "./utils/types.js"
import {Choreographer} from "./choreographer/choreographer.js"
import {establish_choreography_machine} from "./choreo/choreo.js"
import {CharacterInstance} from "./character/character_instance.js"
import {fix_animation_groups} from "./character/utils/fix_animation_groups.js"

export class Loader {
	#scene: Scene

	readonly glb = signals.op<Glb | null>(Op.ready(null))
	#abort: null | (() => Promise<void>) = null

	constructor(scene: Scene) {
		this.#scene = scene
	}

	async unload_glb() {
		const glb = this.glb.payload
		if (glb) {
			glb.dispose()
			this.glb.setReady(null)
		}
		else if (this.#abort) {
			await this.#abort()
		}
	}

	async ingest_glb(file: File) {
		await this.unload_glb()
		await this.glb.load(async() => {
			await nap(200)
			return this.#load_glb_asset_container(fileData(file))
		})
	}

	async ingest_glb_from_url(url: string) {
		await this.unload_glb()
		await this.glb.load(async() => {
			const {promise, abort} = download(url)
			this.#abort = async() => {
				abort()
				return new Promise(resolve => this.glb.once(() => resolve()))
			}
			try {
				const file = await promise
				return file
					? await this.#load_glb_asset_container(file)
					: null
			}
			finally {
				this.#abort = null
			}
		})
	}

	async #load_glb_asset_container(
			{objectUrl, filename, filesize, revokeObjectUrl}: FileData
		): Promise<Glb> {

		const container = await SceneLoader.LoadAssetContainerAsync(
			objectUrl,
			undefined,
			this.#scene,
			() => {},
			".glb",
		)

		revokeObjectUrl()
		container.removeAllFromScene()
		fix_animation_groups(container.animationGroups)
		const character = new CharacterInstance(container, [0, 0, 0])

		return {
			container,
			filename,
			filesize,
			all_animations: [...container.animationGroups],
			choreographer: new Choreographer(character),
			choreography: establish_choreography_machine(character),
			dispose: () => {
				character.dispose()
				container.removeAllFromScene()
				container.dispose()
			},
		}
	}
}

