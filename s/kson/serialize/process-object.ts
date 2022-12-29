
import {notLast} from "./not-last.js"
import {Stack} from "../utils/stack.js"
import {Dictionary} from "../utils/dictionary.js"
import {controlSymbols} from "../text/control-symbols.js"

export function processObject(
		stack: Stack,
		dictionary: Dictionary,
		obj: any,
	) {

	const toStack: any[] = []
	const entries = Object.entries(obj)

	toStack.push(controlSymbols.openobject)

	entries.forEach(([key, value], index) => {
		toStack.push(
			dictionary.getKeyId(key),
			controlSymbols.pairsep,
			value,
		)
		if (notLast(index, entries.length))
			toStack.push(controlSymbols.itemsep)
	})

	stack.pushReverse(toStack)
}
