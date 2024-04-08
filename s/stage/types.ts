
import {Vec4} from "../math/vec4.js"
import {Porthole} from "./parts/porthole.js"
import {Scene} from "@babylonjs/core/scene.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {EngineOptions} from "@babylonjs/core/Engines/thinEngine.js"
import {WebGPUEngineOptions} from "@babylonjs/core/Engines/webgpuEngine.js"

export type EngineSettings = {
	allow_webgpu: boolean
	webgl_options: EngineOptions
	webgpu_options: WebGPUEngineOptions
}

export type CreateStageOptions = EngineSettings & StageExtras

export type CreateEngineOptions = {
	canvas: HTMLCanvasElement
} & EngineSettings

export interface StageExtras {
	background: Vec4
}

export interface StageOptions extends StageExtras {
	porthole: Porthole
	engine: Engine
	scene: Scene
}

