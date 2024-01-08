
import {Scene} from "@babylonjs/core/scene.js"
import {SSRRenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssrRenderingPipeline.js"
import {SSAO2RenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline.js"
import {DefaultRenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline.js"

import {Labeler} from "../../tools/labeler.js"
import {DefaultEffect, SsaoEffect, SsrEffect} from "../types.js"

export const render_pipes = (scene: Scene, label: Labeler) => ({

	default({antialiasing, bloom}: DefaultEffect) {

		const pipe = new DefaultRenderingPipeline(label("default"), true, scene)

		if (antialiasing) {
			pipe.samples = antialiasing.samples
			pipe.fxaaEnabled = antialiasing.fxaa
		}
		else {
			pipe.samples = 1
		}

		if (bloom) {
			pipe.bloomEnabled = true
			pipe.bloomWeight = bloom.weight
			pipe.bloomScale = bloom.scale
			pipe.bloomKernel = bloom.kernel
			pipe.bloomThreshold = bloom.threshold
		}

		return pipe
	},

	ssao(effect: SsaoEffect) {
		const options = {ssaoRatio: effect.ratio, blurRatio: effect.blur}
		const pipe = new SSAO2RenderingPipeline(label("ssao"), scene, options)
		pipe.totalStrength = effect.strength
		pipe.radius = effect.radius
		return pipe
	},

	ssr(effect: SsrEffect) {
		const pipe = new SSRRenderingPipeline(label("ssr"), scene)
		pipe.strength = effect.strength
		pipe.useFresnel = effect.fresnel
		pipe.reflectivityThreshold = effect.threshold
		pipe.reflectionSpecularFalloffExponent = effect.falloff
		pipe.blurDownsample = effect.downsample
		pipe.blurDispersionStrength = effect.blur
		return pipe
	},
})

