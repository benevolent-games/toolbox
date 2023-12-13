
import {Choreographer} from "../choreographer/choreographer.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export type Glb = {
	container: AssetContainer
	filename: string
	filesize: number
	all_animations: AnimationGroup[]
	choreographer: Choreographer
	dispose: () => void
}

export type FileData = {
	objectUrl: string
	filename: string
	filesize: number
	revokeObjectUrl: () => void
}

export type Download = {
	abort: () => void
	promise: Promise<FileData | null>
}

