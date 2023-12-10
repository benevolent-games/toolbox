
import {Choreographer} from "../choreographer/choreographer.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

export type Glb = {
	container: AssetContainer
	filename: string
	filesize: number
	choreographer: Choreographer
}

