
import {Vec4} from "../math/vec4.js"
import {DepthOfFieldEffectBlurLevel} from "@babylonjs/core/PostProcesses/depthOfFieldEffect.js"

export interface StageOptions {
	canvas: HTMLCanvasElement
	background: Vec4
	tickrate: number
}

export interface Effects {
	default: DefaultEffect | null
	ssao: SsaoEffect | null
	ssr: SsrEffect | null
}

export interface DefaultEffect {
	antialiasing: AntialiasingEffect | null
	imageProcessing: ImageProcessingEffect | null
	bloom: BloomEffect | null
	chromaticAberration: ChromaticAberrationEffect | null
	glow: GlowEffect | null
	grain: GrainEffect | null
	sharpen: SharpenEffect | null
	depthOfField: DepthOfFieldEffect | null
}

export interface AntialiasingEffect {
	samples: number
	fxaa: boolean
	adaptScaleToCurrentViewport: boolean
}

export interface ImageProcessingEffect {
	exposure: number
	contrast: number
	adaptScaleToCurrentViewport: boolean
}

export interface DepthOfFieldEffect {
	blurLevel: DepthOfFieldEffectBlurLevel
	fStop: number
	focalLength: number
	focusDistance: number
	lensSize: number
}

export interface BloomEffect {
	weight: number
	scale: number
	kernel: number
	threshold: number
}

export interface ChromaticAberrationEffect {
	aberrationAmount: number
	radialIntensity: number
	adaptScaleToCurrentViewport: boolean
	alphaMode: number
	alwaysForcePOT: boolean
	enablePixelPerfectMode: boolean
	forceFullscreenViewport: boolean
}

export interface GlowEffect {
	blurKernelSize: number
	intensity: number
}

export interface GrainEffect {
	adaptScaleToCurrentViewport: boolean
	animated: boolean
	intensity: number
}

export interface SharpenEffect {
	adaptScaleToCurrentViewport: boolean
	edgeAmount: number
	colorAmount: number
}

export interface SsaoEffect {
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

export interface SsrEffect {
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

