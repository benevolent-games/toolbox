
import {Op, explode_promise, signals} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"

import {Glb} from "./utils/types.js"
import {Choreographer} from "./choreographer/choreographer.js"
import { nap } from "@benev/turtle"

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
			glb.container.removeAllFromScene()
			glb.container.dispose()
			this.glb.setReady(null)
		}
		else if (this.#abort) {
			await this.#abort()
		}
	}

	async ingest(file: File) {
		await this.unload_glb()
		await this.glb.load(() => this.#load_glb_asset_container(fileData(file)))
	}

	async ingest_but_actually_fail() {
		await this.unload_glb()
		await this.glb.load(async() => {
			const {promise, resolve} = explode_promise<FileData | null>()
			const abort = () => resolve(null)
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
	revoke: () => void
}

export type Download = {
	abort: () => void
	promise: Promise<FileData | null>
}

function fileData(file: File): FileData {
	const objectUrl = URL.createObjectURL(file)
	const revoke = () => URL.revokeObjectURL(objectUrl)
	return {
		objectUrl,
		revoke,
		filename: file.name,
		filesize: file.size,
	}
}

function download(url: string): Download {
	const abortController = new AbortController()
	const abort = () => abortController.abort()
	const filename = new URL(url).pathname.split("/").at(-1) ?? "unknown"

	const promise = fetch(url, {signal: abortController.signal})
		.then(response => {
			if (!response.ok)
				throw new Error(`failed to load "${filename}"`)
			return response
		})
		.then(response => response.blob())
		.then(blob => {
			const objectUrl = URL.createObjectURL(blob)
			const revoke = () => URL.revokeObjectURL(objectUrl)
			const data: FileData = {
				objectUrl,
				revoke,
				filename,
				filesize: blob.size,
			}
			return data
		})
		.catch(error => {
			if (error.name === "AbortError")
				return null
			else
				throw error
		})

	return {abort, promise}
}

