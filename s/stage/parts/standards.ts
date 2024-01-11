
import {Effects} from "../types.js"
import {Vec4} from "../../tools/math/vec4.js"

export const backgrounds = {
	transparent: () => [0, 0, 0, 0] as Vec4,
	black: () => [0, 0, 0, 1] as Vec4,
	white: () => [1, 1, 1, 1] as Vec4,
	gray: () => [.1, .1, .1, 1] as Vec4,
	sky: () => [.7, .8, 1, 1] as Vec4,
}

export const effects = {
	everything: () => ({
		default: {
			antialiasing: {
				samples: 4,
				fxaa: true as boolean,
			},
			bloom: {
				weight: .2,
				scale: .5,
				kernel: 32,
				threshold: .6,
			},
		},
		ssao: {
			ratio: .75,
			blur: .75,
			strength: 1,
			radius: 2,
		},
		ssr: {
			strength: .8,
			blur: .08,
			fresnel: true as boolean,
			threshold: .02,
			falloff: 1.5,
			downsample: 1,
		},
	} satisfies Effects),
}
