
import {Stack} from "../utils/stack.js"
import {controlSymbols} from "../text/control-symbols.js"

export function processArray(
		stack: Stack<any>,
		array: any[],
	) {

	const stuff = array.flatMap((item, index) => [
		item,
		...(index < (array.length - 1))
			? [controlSymbols.itemsep]
			: [],
	])

	stack.pushReverse([
		controlSymbols.openarray,
		...stuff,
		controlSymbols.close,
	])
}
