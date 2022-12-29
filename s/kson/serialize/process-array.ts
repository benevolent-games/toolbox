
import {notLast} from "./not-last.js"
import {Stack} from "../utils/stack.js"
import {controlSymbols} from "../text/control-symbols.js"

export function processArray(
		stack: Stack<any>,
		array: any[],
	) {

	const toStack: any[] = [controlSymbols.openarray]

	array.forEach((item, index) => {
		toStack.push(item)
		if (notLast(index, array.length))
			toStack.push(controlSymbols.itemsep)
	})

	toStack.push(controlSymbols.close)
	stack.pushReverse(toStack)
}
