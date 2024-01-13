
import {Vec4} from "../tools/math/vec4.js"

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
	bloom: BloomEffect | null
}

export interface AntialiasingEffect {
	samples: number
	fxaa: boolean
}

export interface BloomEffect {
	weight: number
	scale: number
	kernel: number
	threshold: number
}

export interface SsaoEffect {
	ratio: number
	blur: number
	strength: number
	radius: number
}

export interface SsrEffect {
	strength: number
	blur: number
	fresnel: boolean
	threshold: number
	falloff: number
	downsample: number
}

