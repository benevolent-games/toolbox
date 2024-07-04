
import {AnyCanvas} from "./types.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {EngineOptions} from "@babylonjs/core/Engines/thinEngine.js"
import {WebGPUEngine} from "@babylonjs/core/Engines/webgpuEngine.js"
import {WebGPUEngineOptions} from "@babylonjs/core/Engines/webgpuEngine.js"

export namespace EngineSettings {
	export type WebGPU = {
		canvas: AnyCanvas
		webgpu: WebGPUEngineOptions
	}
	export type WebGL = {
		canvas: AnyCanvas
		webgl: EngineOptions
	}
	export type Auto = {
		canvas: AnyCanvas
		webgl: EngineOptions
		webgpu?: WebGPUEngineOptions
	}
	export type Any = WebGPU | WebGL | Auto
}

export async function make_webgpu_engine(o: EngineSettings.WebGPU) {
	const engine = new WebGPUEngine(o.canvas, o.webgpu)
	await engine.initAsync()
	return engine
}

export async function make_webgl_engine(o: EngineSettings.WebGL) {
	return new Engine(o.canvas, undefined, o.webgl)
}

export async function make_engine(o: EngineSettings.Auto) {
	const webgpuSupported = await WebGPUEngine.IsSupportedAsync
	return (o.webgpu && webgpuSupported)
		? await make_webgpu_engine({...o, webgpu: o.webgpu})
		: await make_webgl_engine(o)
}

