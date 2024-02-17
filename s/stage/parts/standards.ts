
import {Effects} from "../types.js"
import {Vec4} from "../../math/vec4.js"
import {DepthOfFieldEffectBlurLevel} from "@babylonjs/core/PostProcesses/depthOfFieldEffect.js"

export const backgrounds = {
	transparent: () => [0, 0, 0, 0] as Vec4,
	black: () => [0, 0, 0, 1] as Vec4,
	white: () => [1, 1, 1, 1] as Vec4,
	gray: () => [.1, .1, .1, 1] as Vec4,
	sky: () => [.7, .8, 1, 1] as Vec4,
}

export const effects = {
	everything: (): Effects => ({
		default: {
			antialiasing: {
				samples: 4,
				fxaa: true,
				adaptScaleToCurrentViewport: false,
			},
			imageProcessing: {
				contrast: 1,
				exposure: 1,
				adaptScaleToCurrentViewport: false,
			},
			bloom: {
				weight: .2,
				scale: .5,
				kernel: 32,
				threshold: .6,
			},
			chromaticAberration: {
				aberrationAmount: 30,
				radialIntensity: 3,
				adaptScaleToCurrentViewport: false,
				forceFullscreenViewport: true,
				enablePixelPerfectMode: false,
				alwaysForcePOT: false,
				alphaMode: 0,
			},
			glow: {
				blurKernelSize: 16,
				intensity: 1,
			},
			grain: {
				adaptScaleToCurrentViewport: false,
				intensity: 10,
				animated: true,
			},
			sharpen: {
				adaptScaleToCurrentViewport: false,
				colorAmount: 1,
				edgeAmount: 0.3,
			},
			depthOfField: {
				blurLevel: DepthOfFieldEffectBlurLevel.Low,
				fStop: 1.4,
				focalLength: 50,
				focusDistance: 2000,
				lensSize: 50,
			},
		},
		ssao: {
			ssaoRatio: .75,
			blurRatio: .75,
			base: .75,
			bilateralSamples: 16,
			bilateralSoften: 0,
			bilateralTolerance: 0,
			maxZ: 100,
			minZAspect: 0.5,
			radius: 2.0,
			totalStrength: 1.0,
			bypassBlur: true,
			epsilon: 0.02,
			expensiveBlur: false,
			samples: 8,
		},
		ssr: {
			debug: false,
			maxDistance: 1000,
			maxSteps: 1000,
			reflectionSpecularFalloffExponent: 1,
			roughnessFactor: 0.2,
			selfCollisionNumSkip: 1,
			step: 1,
			strength: 1,
			thickness: 0.5,
			attenuateBackfaceReflection: false,
			attenuateFacingCamera: false,
			attenuateIntersectionDistance: true,
			attenuateIntersectionIterations: true,
			attenuateScreenBorders: true,
			backfaceDepthTextureDownsample: 0,
			backfaceForceDepthWriteTransparentMeshes: true,
			blurDispersionStrength: 0.05,
			blurDownsample: 0,
			clipToFrustum: true,
			enableAutomaticThicknessComputation: false,
			enableSmoothReflections: false,
			reflectivityThreshold: 0.04,
			samples: 1,
			ssrDownsample: 0,
			useFresnel: false,
		},
	}),
}

