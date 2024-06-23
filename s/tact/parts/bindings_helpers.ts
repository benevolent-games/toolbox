
import {Bindings} from "../types/bindings.js"

export type BindingsHelpers = typeof bindings_helpers

type Mod = ("ctrl" | "meta" | "alt" | "shift")

export const bindings_helpers = ({
	mode: <M extends Bindings.BindGroup>(m: M) => m,
	buttonGroup: <B extends Bindings.ButtonBinds>(b: B) => b,
	buttons: <B extends Bindings.Btn[]>(...btns: B) => btns,
	b: (name: string): Bindings.Btn => [name, {modless: true}],
	mod: (name: string, ...mods: Mod[]): Bindings.Btn => [name, {
		ctrl: mods.includes("ctrl"),
		meta: mods.includes("meta"),
		alt: mods.includes("alt"),
		shift: mods.includes("shift"),
	}],
	ctrl: "ctrl" as const,
	meta: "meta" as const,
	alt: "alt" as const,
	shift: "shift" as const,
})

