
import {Stack} from "./utils/stack.js"
import {controls} from "./text/controls.js"
import {Dictionary} from "./utils/dictionary.js"
import {processNode} from "./utils/process-node.js"
import {generateKeySpec} from "./utils/generate-key-spec.js"
import {getControlBySymbol} from "./text/get-control-by-symbol.js"

export function serialize(root: any) {
	const results: string[] = []
	const dictionary = new Dictionary()
	const stack = new Stack<any>()
	stack.push([root])

	while (stack.size > 0) {
		const node = stack.pop()

		if (typeof node === "symbol")
			results.push(getControlBySymbol(node))

		else
			processNode(
				node,
				stack,
				dictionary,
				r => results.push(r),
			)
	}

	const payload = results.join("")
	const keySpec = generateKeySpec(dictionary)

	return keySpec
		+ controls.payloadsep
		+ payload
}
