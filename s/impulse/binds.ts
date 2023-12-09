
import {Pojo} from "@benev/slate"
import {Input} from "./input.js"

export type Binds = {[mode: string]: ModeBinds}
export type Mode<B extends Binds> = keyof B

export type ModeBinds = {
	buttons: ButtonBinds
	vectors: VectorBinds
}

export type ButtonBinds = Pojo<Btn[]>
export type VectorBinds = Pojo<string[]>
export type Btn = [string, BtnOpts]
export type BtnOpts = BtnNoMods | Input.Modifiers
export type BtnNoMods = {modless: true}

export function bind_helpers() {
	type Mod = ("ctrl" | "meta" | "alt" | "shift")
	return {
		mode: <M extends ModeBinds>(m: M) => m,
		buttons: <B extends Btn[]>(...btns: B) => btns,
		b: (name: string, ...mods: Mod[]): Btn => [name, {
			ctrl: mods.includes("ctrl"),
			meta: mods.includes("meta"),
			alt: mods.includes("alt"),
			shift: mods.includes("shift"),
		}],
		modless: (name: string): Btn => [name, {modless: true}],
		ctrl: "ctrl" as const,
		meta: "meta" as const,
		alt: "alt" as const,
		shift: "shift" as const,
	}
}

export function binds<B extends Binds>(
		fn: (helpers: ReturnType<typeof bind_helpers>) => B
	) {

	return fn(bind_helpers())
}

