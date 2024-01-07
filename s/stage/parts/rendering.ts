
import {Scene} from "@babylonjs/core/scene.js"
import {SSRRenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssrRenderingPipeline.js"
import {PostProcessRenderPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipeline.js"
import {SSAO2RenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline.js"
import {DefaultRenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline.js"

import {Effects, BloomEffect, SsaoEffect, SsrEffect} from "../types.js"

export class Rendering {

	static pipe_default(scene: Scene, effect: BloomEffect | null) {
		const pipe = new DefaultRenderingPipeline("default", true, scene)
		if (effect) {
			pipe.bloomEnabled = true
			pipe.bloomScale = effect.scale
			pipe.bloomKernel = effect.kernel
			pipe.bloomThreshold = effect.threshold
		}
		else {
			pipe.bloomEnabled = false
		}
		return pipe
	}

	static pipe_ssao(scene: Scene, effect: SsaoEffect) {
		const pipe = new SSAO2RenderingPipeline("ssao", scene, 0.75)
		pipe.totalStrength = effect.strength
		pipe.radius = effect.radius
		return pipe
	}

	static pipe_ssr(scene: Scene, effect: SsrEffect) {
		const pipe = new SSRRenderingPipeline("ssr", scene, undefined, false)
		pipe.strength = effect.strength
		pipe.useFresnel = effect.fresnel
		pipe.reflectivityThreshold = effect.threshold
		pipe.reflectionSpecularFalloffExponent = effect.falloff
		pipe.blurDownsample = effect.downsample
		pipe.blurDispersionStrength = effect.blur
		return pipe
	}

	pipelines: PostProcessRenderPipeline[] = []
	defpipe: DefaultRenderingPipeline
	ssao: SSAO2RenderingPipeline | null
	ssr: SSRRenderingPipeline | null

	pipe<P extends PostProcessRenderPipeline>(pipe: P) {
		this.pipelines.push(pipe)
		return pipe
	}

	constructor({scene, effects}: {
			scene: Scene
			effects: Effects
		}) {

		this.defpipe = this.pipe(Rendering.pipe_default(scene, effects.bloom))

		this.ssao = effects.ssao
			? this.pipe(Rendering.pipe_ssao(scene, effects.ssao))
			: null

		this.ssr = effects.ssr
			? this.pipe(Rendering.pipe_ssr(scene, effects.ssr))
			: null
	}
}

