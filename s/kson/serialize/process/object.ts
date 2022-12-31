
import {Stack} from "../../utils/stack.js"
import {notLast} from "../utils/not-last.js"
import {Dictionary} from "../../utils/dictionary.js"
import {controlSymbols} from "../../text/control-symbols.js"

export function processObject(
		stack: Stack,
		dictionary: Dictionary,
		obj: any,
	) {

	const toStack: any[] = [controlSymbols.openobject]
	const entries = Object.entries(obj)

	entries.forEach(([key, value], index) => {
		toStack.push(
			dictionary.getKeyId(key),
			controlSymbols.pairsep,
			value,
		)

		if (notLast(index, entries.length))
			toStack.push(controlSymbols.itemsep)
	})

	toStack.push(controlSymbols.close)
	stack.pushReverse(toStack)
}
