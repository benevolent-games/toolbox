
import {Vec4} from "../tools/math/vec4.js"

export interface StageOptions {
	canvas: HTMLCanvasElement
	background: Vec4
}

export interface Effects {
	bloom: BloomEffect | null
	ssao: SsaoEffect | null
	ssr: SsrEffect | null
}

export interface BloomEffect {
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

