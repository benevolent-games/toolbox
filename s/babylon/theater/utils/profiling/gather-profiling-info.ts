
import {ProfilingInfo} from "./profiling-info.js"
import {Instrumentation} from "./instrumentation.js"

export function gatherProfilingInfo({
		sceneInstrumentation: scene,
		engineInstrumentation: engine,
	}: Instrumentation): ProfilingInfo {

	return {

		"gpu time":
			engine.gpuFrameTimeCounter.current * 0.000001,

		"draw time":
			scene.drawCallsCounter.current,

		"frame time":
			scene.frameTimeCounter.current,

		"physics time":
			scene.physicsTimeCounter.current,

		"inter frame time":
			scene.interFrameTimeCounter.current,

		"camera render time":
			scene.cameraRenderTimeCounter.current,

		"active meshes evaluation time":
			scene.activeMeshesEvaluationTimeCounter.current,

	}
}
