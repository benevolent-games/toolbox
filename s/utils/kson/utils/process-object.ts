
import {Stack} from "./stack.js"
import {Dictionary} from "./dictionary.js"
import {controlSymbols} from "../text/control-symbols.js"

export function processObject(
		stack: Stack,
		dictionary: Dictionary,
		obj: any,
	) {

	const entries = [...Object.entries(obj)]

	const stuff = entries.flatMap(([key, value], index) => [
		dictionary.getKeyId(key),
		controlSymbols.pairsep,
		value,
		...(index < (entries.length - 1))
			? [controlSymbols.itemsep]
			: []
	])

	stack.pushReverse([
		controlSymbols.openobject,
		...stuff,
		controlSymbols.close,
	])
}
