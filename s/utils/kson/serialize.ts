
import {obtool} from "@chasemoskal/magical"

import {controls} from "./text/controls.js"
import {setupKeyMap} from "./utils/setup-key-map.js"

/*

{DATA}

(openarray)
	(openobject)
		{ID}(pairsep){DATA}
			(itemsep)
		{ID}(pairsep)(openarray)
			{DATA}
				(itemsep)
			{DATA}
		(close)
	(close)
(close)

*/

export function trampoline<T>(fun: (...args: any[]) => T) {
	return (...args: any[]) => {
		let result = fun(...args)

		while (typeof result === "function")
			result = result()

		return result
	}
}


export function type(data: any): Ast.Type {
	const isArray = Array.isArray(data)
	const isObject = typeof data === "object" && !!data

	return isObject
		? isArray
			? Ast.Type.Array
			: Ast.Type.Object
		: Ast.Type.Primitive
}

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

export function makeStack<T>() {
	let memory: T[] = []

	return {

		push(...t: T[]) {
			memory.push(...t)
		},

		pushReverse(...t: T[]) {
			t.reverse()
			memory.push(...t)
		},

		pop() {
			return memory.pop()
		},

		clear() {
			memory = []
		},

		get size() {
			return memory.length
		},

		get memory() {
			return [...memory]
		},
	}
}

const controlSymbols = (
	obtool(controls)
		.map(() => Symbol())
)

function getControl(symbol: symbol) {
	const known = (
		Object
			.entries(controlSymbols)
			.find(([,value]) => value === symbol)
	)

	if (!known)
		throw new Error("unknown symbol")

	const [name] = known
	return controls[<keyof typeof controls>name]
}

export function packValue(x: any) {
	return JSON.stringify(x)
}

export function serialize(root: any) {
	const results: string[] = []

	const {getKeyId, getKeyMapEntries} = setupKeyMap()
	const stack = makeStack<any>()
	stack.push(root)

	while (stack.size > 0) {
		const node = stack.pop()

		if (typeof node === "symbol")
			results.push(getControl(node))

		else {
			switch (type(node)) {

				case Ast.Type.Primitive: {
					results.push(packValue(node))
				} break

				case Ast.Type.Array: {
					const items = <any[]>node
					const stuff = items.flatMap((item, index) => [
						item,
						...(index < (items.length - 1))
							? [controlSymbols.itemsep]
							: [],
					])
					stack.pushReverse(
						controlSymbols.openarray,
						...stuff,
						controlSymbols.close,
					)
				} break

				case Ast.Type.Object: {
					const entries = [...Object.entries(node)]
					stack.pushReverse(
						controlSymbols.openobject,
						...entries.flatMap(([key, value], index) => [
							getKeyId(key),
							controlSymbols.pairsep,
							value,
							...(index < (entries.length - 1))
								? [controlSymbols.itemsep]
								: []
						]),
						controlSymbols.close,
					)
				} break

				default:
					throw new Error("unknown type")
			}
		}
	}

	const payload = results.join("")
	const keys = getKeyMapEntries()
	const keyspec = keys
		.map(([key, id], index) => [
			key,
			controls.pairsep,
			JSON.stringify(id),
			...(index === (keys.length - 1))
				? []
				: [controls.itemsep],
		])
		.flat()
		.join("")

	return keyspec
		+ controls.payloadsep
		+ payload
}
