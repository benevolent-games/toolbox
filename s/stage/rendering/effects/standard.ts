
import {DefaultPipelineEffects, Effects, ImageProcessingEffects} from "./types.js"

export const standard_effects = {

	image_processing: (): ImageProcessingEffects => ({
		image: {
			contrast: 1,
			exposure: 1,
		},

		tonemapping: {
			operator: "Photographic",
		},

		vignette: {
			color: [0, 0, 0],
			weight: 1,
			stretch: 1,
			multiply: true,
		},
	}),

	default_pipeline: (): DefaultPipelineEffects => ({
		...standard_effects.image_processing(),

		antialiasing: {
			samples: 4,
			fxaa: true,
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
		},

		glow: {
			blurKernelSize: 16,
			intensity: 1,
		},

		sharpen: {
			colorAmount: 1,
			edgeAmount: 0.3,
		},
	}),

	everything: (): Effects => ({
		...standard_effects.default_pipeline(),

		scene: {
			clearColor: [.1, .1, .1],
			ambientColor: [0, 0, 0],
			shadowsEnabled: true,
			environmentIntensity: 1,
			forceWireframe: false,
			forceShowBoundingBoxes: false,
			useOrderIndependentTransparency: false,
		},

		prePassRenderer: {
			disableGammaTransform: false,
		},

		depthRenderer: {},

		fog: {
			mode: "exp2",
			color: [.1, .1, .1],
			start: 1,
			end: 100,
			density: 0.1,
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
			radius: 2,
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
			reflectivityThreshold: 0.01,
			samples: 1,
			ssrDownsample: 0,
			useFresnel: false,
		},

		lens: {
			ratio: 1,
			chromatic_aberration: 0,
			edge_blur: 0,
			distortion: 0,
			grain_amount: 0,
			dof_focus_distance: 10,
			dof_aperture: 1,
			dof_darken: 0,
			dof_pentagon: true,
			dof_gain: 1,
			dof_threshold: 1,
			blur_noise: true,
		},
	})
}

