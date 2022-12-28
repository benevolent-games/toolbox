
import {Ast} from "./types/ast.js"
import {type} from "./utils/type.js"
import {Stack} from "./utils/stack.js"
import {controls} from "./text/controls.js"
import {packValue} from "./utils/pack-value.js"
import {setupKeyMap} from "./utils/setup-key-map.js"
import {controlSymbols} from "./text/control-symbols.js"
import {getControlBySymbol} from "./text/get-control-by-symbol.js"

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

export function serialize(root: any) {
	const results: string[] = []

	const {getKeyId, getKeyMapEntries} = setupKeyMap()
	const stack = new Stack<any>()
	stack.push(root)

	while (stack.size > 0) {
		const node = stack.pop()

		if (typeof node === "symbol")
			results.push(getControlBySymbol(node))

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
