
import {Scene} from "@babylonjs/core/scene.js"
import {SSRRenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssrRenderingPipeline.js"
import {SSAO2RenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline.js"
import {DefaultRenderingPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline.js"

import {Labeler} from "../../tools/label.js"
import {DefaultEffect, SsaoEffect, SsrEffect} from "../types.js"
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer.js"

export const render_pipes = (scene: Scene, label: Labeler) => ({

	default({
			antialiasing,
			imageProcessing,
			bloom,
			glow,
			depthOfField,
			grain,
			sharpen,
			chromaticAberration,
		}: DefaultEffect) {

		const pipe = new DefaultRenderingPipeline(label("default"), true, scene)

		if (antialiasing) {
			if (pipe.fxaa) {
				pipe.fxaaEnabled = antialiasing.fxaa
				pipe.fxaa.adaptScaleToCurrentViewport = antialiasing.adaptScaleToCurrentViewport
				pipe.fxaa.samples = antialiasing.samples
				pipe.samples = 0
			}
			else {
				pipe.samples = antialiasing.samples
			}
		}

		if (imageProcessing) {
			pipe.imageProcessingEnabled = true
			pipe.imageProcessing.contrast = imageProcessing.contrast
			pipe.imageProcessing.exposure = imageProcessing.exposure
			pipe.imageProcessing.adaptScaleToCurrentViewport = imageProcessing.adaptScaleToCurrentViewport
		}

		if (bloom) {
			pipe.bloomEnabled = true
			pipe.bloomWeight = bloom.weight
			pipe.bloomScale = bloom.scale
			pipe.bloomKernel = bloom.kernel
			pipe.bloomThreshold = bloom.threshold
		}

		if (glow) {
			const glowLayer = new GlowLayer(label("glow"), scene)
			glowLayer.blurKernelSize = glow.blurKernelSize
			glowLayer.intensity = glow.intensity
			pipe.glowLayerEnabled = true
		}

		if (depthOfField) {
			pipe.depthOfFieldEnabled = true
			pipe.depthOfFieldBlurLevel = depthOfField.blurLevel
			pipe.depthOfField.fStop = depthOfField.fStop
			pipe.depthOfField.focalLength = depthOfField.focalLength
			pipe.depthOfField.focusDistance = depthOfField.focusDistance
			pipe.depthOfField.lensSize = depthOfField.lensSize
		}

		if (grain) {
			pipe.grainEnabled = true
			pipe.grain.adaptScaleToCurrentViewport = grain.adaptScaleToCurrentViewport
			pipe.grain.animated = grain.animated
			pipe.grain.intensity = grain.intensity
		}

		if (sharpen) {
			pipe.sharpenEnabled = true
			pipe.sharpen.adaptScaleToCurrentViewport = sharpen.adaptScaleToCurrentViewport
			pipe.sharpen.edgeAmount = sharpen.edgeAmount
			pipe.sharpen.colorAmount = sharpen.colorAmount
		}

		if (chromaticAberration) {
			const c = chromaticAberration
			pipe.chromaticAberrationEnabled = true
			pipe.chromaticAberration.adaptScaleToCurrentViewport = c.adaptScaleToCurrentViewport
			pipe.chromaticAberration.aberrationAmount = c.aberrationAmount
			pipe.chromaticAberration.alphaMode = c.alphaMode
			pipe.chromaticAberration.alwaysForcePOT = c.alwaysForcePOT
			pipe.chromaticAberration.enablePixelPerfectMode = c.enablePixelPerfectMode
			pipe.chromaticAberration.forceFullscreenViewport = c.forceFullscreenViewport
		}

		return pipe
	},

	ssao(effect: SsaoEffect) {
		const options = {ssaoRatio: effect.ssaoRatio, blurRatio: effect.blurRatio}
		const pipe = new SSAO2RenderingPipeline(label("ssao"), scene, options)
		pipe.base = effect.base
		pipe.bilateralSamples = effect.bilateralSamples
		pipe.bilateralSoften = effect.bilateralSoften
		pipe.bilateralTolerance = effect.bilateralTolerance
		pipe.maxZ = effect.maxZ
		pipe.minZAspect = effect.minZAspect
		pipe.radius = effect.radius
		pipe.totalStrength = effect.totalStrength
		pipe.bypassBlur = effect.bypassBlur
		pipe.epsilon = effect.epsilon
		pipe.expensiveBlur = effect.expensiveBlur
		pipe.samples = effect.samples
		return pipe
	},

	ssr(effect: SsrEffect) {
		const pipe = new SSRRenderingPipeline(label("ssr"), scene)
		pipe.debug = effect.debug
		pipe.maxDistance = effect.maxDistance
		pipe.maxSteps = effect.maxSteps
		pipe.reflectionSpecularFalloffExponent = effect.reflectionSpecularFalloffExponent
		pipe.roughnessFactor = effect.roughnessFactor
		pipe.selfCollisionNumSkip = effect.selfCollisionNumSkip
		pipe.step = effect.step
		pipe.strength = effect.strength
		pipe.thickness = effect.thickness
		pipe.attenuateBackfaceReflection = effect.attenuateBackfaceReflection
		pipe.attenuateFacingCamera = effect.attenuateFacingCamera
		pipe.attenuateIntersectionDistance = effect.attenuateIntersectionDistance
		pipe.attenuateIntersectionIterations = effect.attenuateIntersectionIterations
		pipe.attenuateScreenBorders = effect.attenuateScreenBorders
		pipe.backfaceDepthTextureDownsample = effect.backfaceDepthTextureDownsample
		pipe.backfaceForceDepthWriteTransparentMeshes = effect.backfaceForceDepthWriteTransparentMeshes
		pipe.blurDispersionStrength = effect.blurDispersionStrength
		pipe.blurDownsample = effect.blurDownsample
		pipe.clipToFrustum = effect.clipToFrustum
		pipe.enableAutomaticThicknessComputation = effect.enableAutomaticThicknessComputation
		pipe.enableSmoothReflections = effect.enableSmoothReflections
		pipe.reflectivityThreshold = effect.reflectivityThreshold
		pipe.samples = effect.samples
		pipe.ssrDownsample = effect.ssrDownsample
		pipe.useFresnel = effect.useFresnel
		return pipe
	},
})

