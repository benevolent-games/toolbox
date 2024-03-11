
import {Input} from "./input.js"
import {Pojo} from "@benev/slate"

export namespace Bindings {
	export type Catalog = {[mode: string]: BindGroup}
	export type Mode<B extends Catalog> = keyof B

	export type BindGroup = {
		buttons: ButtonBinds
		vectors: VectorBinds
	}

	export type ButtonBinds = Pojo<Btn[]>
	export type VectorBinds = Pojo<string[]>
	export type Btn = [string, BtnOpts]
	export type BtnOpts = BtnNoMods | Input.Modifiers
	export type BtnNoMods = {modless: true}
}

