
import {Stack} from "../utils/stack.js"
import {controls} from "../text/controls.js"
import {Dictionary} from "../utils/dictionary.js"
import {processNode} from "./utils/process-node.js"
import {generateKeySpec} from "./utils/generate-key-spec.js"
import {getControlBySymbol} from "../text/get-control-by-symbol.js"

export function blockingSerialize(root: any) {
	let results = ""
	const dictionary = new Dictionary()
	const stack = new Stack<any>([root])
	const pushResult = (r: string) => results += r

	while (stack.size > 0) {
		const node = stack.pop()

		if (typeof node === "symbol")
			pushResult(getControlBySymbol(node))

		else
			processNode(
				node,
				stack,
				dictionary,
				pushResult,
			)
	}

	return generateKeySpec(dictionary)
		+ controls.payloadsep
		+ results
}
