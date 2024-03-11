
import {Vec2} from "../../math/vec2.js"

export namespace Input {
	export type Kind = "button" | "vector"

	export type Modifiers = {
		ctrl: boolean
		meta: boolean
		alt: boolean
		shift: boolean
	}

	export interface Base {
		kind: Kind
		event: Event | null
	}

	export interface Button extends Base {
		kind: "button"
		code: string
		down: boolean
		mods: Modifiers
		repeat: boolean
	}

	export interface Vector extends Base {
		kind: "vector"
		channel: string
		vector: Vec2
	}

	export type Whatever = Button | Vector
}

