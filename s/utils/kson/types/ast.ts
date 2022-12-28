
export namespace Ast {
	export enum Type {
		Primitive,
		Array,
		Object,
	}

	export enum Control {
		Open,
		Close,
		Primitive,
	}

	export interface Base {
		control: Control
	}

	export interface Primitive extends Base {
		control: Control.Primitive
		value: any
	}

	export interface Open extends Base {
		control: Control.Open
		type: Type
	}

	export interface Close extends Base {
		control: Control.Close
		type: Type
	}

	export type Token = Primitive | Open | Close
}
