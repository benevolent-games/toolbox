
import {html} from "lit"
import {view} from "@chasemoskal/magical"
import {setupInterval} from "../utils/setup-interval.js"
import {SceneInstrumentation} from "@babylonjs/core/Instrumentation/sceneInstrumentation.js"
import {EngineInstrumentation} from "@babylonjs/core/Instrumentation/engineInstrumentation.js"

import bugReport from "../../../icons/material-design-icons/bug-report.js"

export const Profiling = view({}, use => ({
		sceneInstrumentation,
		engineInstrumentation,
	}: {
		sceneInstrumentation: SceneInstrumentation,
		engineInstrumentation: EngineInstrumentation,
	}) => {

	const [isPanelOpen, setPanelOpen] = use.state(false)

	const [gpuTime, setGpuTime] = use.state("0")
	const [drawTime, setDrawTime] = use.state("0")
	const [frameTime, setFrameTime] = use.state("0")
	const [physicsTime, setPhysicsTime] = use.state("0")
	const [interFrameTime, setInterFrameTime] = use.state("0")
	const [cameraRenderTime, setCameraRenderTime] = use.state("0")
	const [activeMeshesEvaluationTime, setActiveMeshesEvaluationTime] = use.state("0")

	use.setup(
		setupInterval(
			100,
			() => {
				setGpuTime(
					(engineInstrumentation.gpuFrameTimeCounter.current * 0.000001)
						.toFixed(2)
				)
				setDrawTime(
					(sceneInstrumentation.drawCallsCounter.current).toFixed(2)
				)
				setFrameTime(
					(sceneInstrumentation.frameTimeCounter.current).toFixed(2)
				)
				setPhysicsTime(
					(sceneInstrumentation.physicsTimeCounter.current).toFixed(2)
				)
				setInterFrameTime(
					(sceneInstrumentation.interFrameTimeCounter.current).toFixed(2)
				)
				setCameraRenderTime(
					(sceneInstrumentation.cameraRenderTimeCounter.current).toFixed(2)
				)
				setActiveMeshesEvaluationTime(
					(sceneInstrumentation.activeMeshesEvaluationTimeCounter.current)
						.toFixed(2)
				)
			}
		),
	)

	function togglePanel() {
		setPanelOpen(!isPanelOpen)
	}

	return html`
		<div
			class="profile-info"
			?data-opened=${isPanelOpen}>
			<button @click=${togglePanel}>
				${bugReport}
			</button>
			
			<div 
				class="profile-panel"
				?data-opened=${isPanelOpen}>
				<p>${`draw time: ${drawTime}ms`}</p>
				<p>${`gpu frame time: ${gpuTime}ms`}</p>
				<p>${`physics time: ${physicsTime}ms`}</p>
				<p>${`inner frame time: ${interFrameTime}ms`}</p>
				<p>${`camera render time: ${cameraRenderTime}ms`}</p>
				<p>${`frame time: ${frameTime}ms`}</p>
				<p>${`active mesh evaluation time: ${activeMeshesEvaluationTime}ms`}</p>
			</div>
		</div>
	`
})
