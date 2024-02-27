
import {Effects} from "../../../../../stage/rendering/effects/types.js"

export function effectsMetas<M extends Meta.All>(metas: M) {
	return metas
}

export namespace Meta {
	export class Boolean {}
	export class Color {}
	export class SelectString<S extends string> {
		constructor(public options: S[]) {}
	}
	export class Number {
		constructor(public granularity: {
			min: number
			max: number
			step: number
		}) {}
	}
	export type Any = (
		| Boolean
		| Color
		| Number
		| SelectString<string>
	)
	///////////////
	export type Value<V> = (
		V extends number ?Number:
		V extends boolean ?Boolean:
		V extends string ?SelectString<string>:
		V extends any[] ?Color:
		Any
	)
	export type Group<G extends Effects[keyof Effects]> = {
		[K2 in keyof G]: Value<G[K2]>
	}
	export type All = {
		[K in keyof Effects]: Group<Effects[K]>
	}
	///////////////
	export const boolean = new Boolean()
	export const color = new Color()
	export const granularity = {
		superfine: new Number({min: 0, max: .2, step: .0001}),
		fine: new Number({min: 0, max: 1, step: .001}),
		small: new Number({min: 0, max: 2, step: .001}),
		medium: new Number({min: 0, max: 10, step: .01}),
		coarse: new Number({min: 0, max: 100, step: .1}),
		coarser: new Number({min: 0, max: 1000, step: 1}),
		giant: new Number({min: 0, max: 5_000, step: 10}),
		samples: new Number({min: 0, max: 64, step: 1}),
		bigSamples: new Number({min: 0, max: 512, step: 8}),
		integer: new Number({min: 0, max: 100, step: 1}),
	}
}

