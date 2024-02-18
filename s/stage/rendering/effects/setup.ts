
import {Scene} from "@babylonjs/core/scene.js"
import {Color4} from "@babylonjs/core/Maths/math.color.js"
import {GlowLayer} from "@babylonjs/core/Layers/glowLayer.js"
import {TonemappingOperator} from "@babylonjs/core/PostProcesses/tonemapPostProcess.js"
import {ImageProcessingConfiguration} from "@babylonjs/core/Materials/imageProcessingConfiguration.js"
import {SSRRenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssrRenderingPipeline.js"
import {PostProcessRenderPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipeline.js"
import {LensRenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/lensRenderingPipeline.js"
import {SSAO2RenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline.js"
import {DefaultRenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline.js"

import {EffectRig, Effects} from "./types.js"
import {label} from "../../../tools/label.js"
import {standard_effects} from "./standard.js"

const standard = standard_effects.everything()

export function setup_effects(scene: Scene, effects: Partial<Effects>): EffectRig {
	const pipelines: PostProcessRenderPipeline[] = []
	const disposables: (() => void)[] = []

	scene.enableDepthRenderer()
	scene.enablePrePassRenderer()
	// scene.enableGeometryBufferRenderer()

	disposables.push(() => {
		scene.disableDepthRenderer()
		scene.disablePrePassRenderer()
		// scene.disableGeometryBufferRenderer()
	})

	//
	// DEFAULT PIPELINE
	//

	const defaultPipeline = new DefaultRenderingPipeline(label("default"), true, scene)
	pipelines.push(defaultPipeline)
	const p = defaultPipeline

	if (effects.antialiasing) {
		const e = effects.antialiasing
		p.fxaaEnabled = e.fxaa
		if (p.fxaa) {
			p.fxaa.samples = e.samples
			p.samples = 0
		}
		else {
			p.samples = e.samples
		}
	}

	disposables.push(() => {
		p.imageProcessingEnabled = false
	})

	if (effects.imageProcessing) {
		const e = effects.imageProcessing
		p.imageProcessingEnabled = true
		p.imageProcessing.contrast = e.contrast ?? standard.imageProcessing.contrast
		p.imageProcessing.exposure = e.exposure ?? standard.imageProcessing.exposure
	}

	if (effects.tonemapping) {
		const e = effects.tonemapping
		p.imageProcessingEnabled = true
		p.imageProcessing.toneMappingEnabled = true
		p.imageProcessing.toneMappingType = (
			e.operator === "Photographic" ? TonemappingOperator.Photographic :
			e.operator === "Hable" ? TonemappingOperator.Hable :
			e.operator === "HejiDawson" ? TonemappingOperator.HejiDawson :
			e.operator === "Reinhard" ? TonemappingOperator.Reinhard :
			TonemappingOperator.Photographic
		)
	}

	if (effects.vignette) {
		const e = effects.vignette
		p.imageProcessingEnabled = true
		p.imageProcessing.vignetteEnabled = true
		p.imageProcessing.vignetteColor = new Color4(...e.color)
		p.imageProcessing.vignetteStretch = e.stretch
		p.imageProcessing.vignetteWeight = e.weight
		p.imageProcessing.vignetteBlendMode = (
			e.multiply
				? ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY
				: ImageProcessingConfiguration.VIGNETTEMODE_OPAQUE
		)
	}

	if (effects.bloom) {
		const e = effects.bloom
		p.bloomEnabled = true
		p.bloomWeight = e.weight
		p.bloomScale = e.scale
		p.bloomKernel = e.kernel
		p.bloomThreshold = e.threshold
	}

	if (effects.chromaticAberration) {
		const e = effects.chromaticAberration
		p.chromaticAberrationEnabled = true
		p.chromaticAberration.radialIntensity = e.radialIntensity
		p.chromaticAberration.aberrationAmount = e.aberrationAmount
	}

	if (effects.glow) {
		const e = effects.glow
		const glow = new GlowLayer(label("glow"), scene)
		disposables.push(() => glow.dispose())
		glow.blurKernelSize = e.blurKernelSize
		glow.intensity = e.intensity
	}

	if (effects.sharpen) {
		const e = effects.sharpen
		p.sharpenEnabled = true
		p.sharpen.edgeAmount = e.edgeAmount
		p.sharpen.colorAmount = e.colorAmount
	}

	//
	// NON-DEFAULT PIPELINES
	//

	if (effects.ssao) {
		const e = effects.ssao
		const options = {ssaoRatio: e.ssaoRatio, blurRatio: e.blurRatio}
		const p = new SSAO2RenderingPipeline(label("ssao"), scene, options)
		pipelines.push(p)
		p.base = e.base
		p.bilateralSamples = e.bilateralSamples
		p.bilateralSoften = e.bilateralSoften
		p.bilateralTolerance = e.bilateralTolerance
		p.maxZ = e.maxZ
		p.minZAspect = e.minZAspect
		p.radius = e.radius
		p.totalStrength = e.totalStrength
		p.bypassBlur = e.bypassBlur
		p.epsilon = e.epsilon
		p.expensiveBlur = e.expensiveBlur
		p.samples = e.samples
	}

	if (effects.ssr) {
		const e = effects.ssr
		const p = new SSRRenderingPipeline(label("ssr"), scene)
		pipelines.push(p)
		p.debug = e.debug
		p.maxDistance = e.maxDistance
		p.maxSteps = e.maxSteps
		p.reflectionSpecularFalloffExponent = e.reflectionSpecularFalloffExponent
		p.roughnessFactor = e.roughnessFactor
		p.selfCollisionNumSkip = e.selfCollisionNumSkip
		p.step = e.step
		p.strength = e.strength
		p.thickness = e.thickness
		p.attenuateBackfaceReflection = e.attenuateBackfaceReflection
		p.attenuateFacingCamera = e.attenuateFacingCamera
		p.attenuateIntersectionDistance = e.attenuateIntersectionDistance
		p.attenuateIntersectionIterations = e.attenuateIntersectionIterations
		p.attenuateScreenBorders = e.attenuateScreenBorders
		p.backfaceDepthTextureDownsample = e.backfaceDepthTextureDownsample
		p.backfaceForceDepthWriteTransparentMeshes = e.backfaceForceDepthWriteTransparentMeshes
		p.blurDispersionStrength = e.blurDispersionStrength
		p.blurDownsample = e.blurDownsample
		p.clipToFrustum = e.clipToFrustum
		p.enableAutomaticThicknessComputation = e.enableAutomaticThicknessComputation
		p.enableSmoothReflections = e.enableSmoothReflections
		p.reflectivityThreshold = e.reflectivityThreshold
		p.samples = e.samples < 1 ? 1 : e.samples
		p.ssrDownsample = e.ssrDownsample
		p.useFresnel = e.useFresnel
	}

	if (effects.lens) {
		const ratio = 1.0
		pipelines.push(
			new LensRenderingPipeline(
				label("lens"),
				effects.lens,
				scene,
				ratio,
			)
		)
	}

	return {
		effects,
		pipelines,
		dispose() {
			for (const dispose of disposables)
				dispose()
			for (const pipeline of pipelines) {
				scene.postProcessRenderPipelineManager.removePipeline(pipeline.name)
				pipeline.dispose()
			}
		},
	}
}

