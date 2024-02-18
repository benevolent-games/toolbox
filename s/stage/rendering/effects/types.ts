
import {Vec4} from "../../../math/vec4.js"

import {PostProcessRenderPipeline} from "@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipeline.js"

export type EffectRig = {
	effects: Partial<Effects> | null
	pipelines: PostProcessRenderPipeline[]
	dispose: () => void
}

export interface Effects {
	ssao: {
		ssaoRatio: number
		blurRatio: number
		base: number
		bilateralSamples: number
		bilateralSoften: number
		bilateralTolerance: number
		maxZ: number
		minZAspect: number
		radius: number
		totalStrength: number
		bypassBlur: boolean
		epsilon: number
		expensiveBlur: boolean
		samples: number
	}

	ssr: {
		debug: boolean
		maxDistance: number
		maxSteps: number
		reflectionSpecularFalloffExponent: number
		roughnessFactor: number
		selfCollisionNumSkip: number
		step: number
		strength: number
		thickness: number
		attenuateBackfaceReflection: boolean
		attenuateFacingCamera: boolean
		attenuateIntersectionDistance: boolean
		attenuateIntersectionIterations: boolean
		attenuateScreenBorders: boolean
		backfaceDepthTextureDownsample: number
		backfaceForceDepthWriteTransparentMeshes: boolean
		blurDispersionStrength: number
		blurDownsample: number
		clipToFrustum: boolean
		enableAutomaticThicknessComputation: boolean
		enableSmoothReflections: boolean
		reflectivityThreshold: number
		samples: number
		ssrDownsample: number
		useFresnel: boolean
	}

	lens: {
		chromatic_aberration: number
		edge_blur: number
		distortion: number
		grain_amount: number
		dof_focus_distance: number
		dof_aperture: number
		dof_darken: number
		dof_pentagon: boolean
		dof_gain: number
		dof_threshold: number
		blur_noise: boolean
	}

	//
	// DEFAULTS
	//

	antialiasing: {
		samples: number
		fxaa: boolean
	}

	imageProcessing: {
		exposure: number
		contrast: number
	}

	tonemapping: {
		operator: "Hable" | "HejiDawson" | "Reinhard" | "Photographic"
	}

	vignette: {
		color: Vec4
		stretch: number
		weight: number
		multiply: boolean
	}

	bloom: {
		weight: number
		scale: number
		kernel: number
		threshold: number
	}

	chromaticAberration: {
		aberrationAmount: number
		radialIntensity: number
	}

	glow: {
		blurKernelSize: number
		intensity: number
	}

	sharpen: {
		edgeAmount: number
		colorAmount: number
	}

	// grain: {
	// 	animated: boolean
	// 	intensity: number
	// 	// adaptScaleToCurrentViewport: boolean
	// }

	// depthOfField: {
	// 	blurLevel: DepthOfFieldEffectBlurLevel
	// 	fStop: number
	// 	focalLength: number
	// 	focusDistance: number
	// 	lensSize: number
	// }
}

