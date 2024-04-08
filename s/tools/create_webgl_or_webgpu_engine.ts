
import {CreateEngineOptions} from "../stage/types.js"
import {Engine} from "@babylonjs/core/Engines/engine.js"
import {WebGPUEngine} from "@babylonjs/core/Engines/webgpuEngine.js"

export async function create_webgl_or_webgpu_engine({
		allow_webgpu, canvas, webgpu_options, webgl_options,
	}: CreateEngineOptions) {

	if (allow_webgpu && await WebGPUEngine.IsSupportedAsync) {
		const engine = new WebGPUEngine(canvas, webgpu_options)
		await engine.initAsync()
		return engine
	}
	else {
		return new Engine(canvas, undefined, webgl_options)
	}
}

