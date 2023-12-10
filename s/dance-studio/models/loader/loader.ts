
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
		await this.glb.run(() => this.#load_glb_asset_container(fileData(file)))
	}

	async ingest_glb_from_url(url: string) {
		if (this.glb.isLoading())
			return

		this.unload_glb()

		await this.glb.run(async() => {
			const file = await download(url)
			return await this.#load_glb_asset_container(file)
		})
	}

	async #load_glb_asset_container(
			{objectUrl, filename, filesize}: FileData
		): Promise<Glb> {

		const container = await SceneLoader.LoadAssetContainerAsync(
			objectUrl,
			undefined,
			this.#scene,
			() => {},
			".glb",
		)

		container.addAllToScene()

		return {
			container,
			filename,
			filesize,
			choreographer: new Choreographer(container.animationGroups),
		}
	}
}

export type FileData = {
	objectUrl: string
	filename: string
	filesize: number
}

function fileData(file: File): FileData {
	return {
		objectUrl: URL.createObjectURL(file),
		filename: file.name,
		filesize: file.size,
	}
}

async function download(url: string): Promise<FileData> {
	const response = await fetch(url)

	if (!response.ok)
		throw new Error(`failed ${response.statusText}`)

	const blob = await response.blob()
	const objectUrl = URL.createObjectURL(blob)
	const filesize = blob.size
	const filename = new URL(url).pathname.split("/").at(-1) ?? "unknown"

	return {objectUrl, filename, filesize}
}

