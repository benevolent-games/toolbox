
import {type} from "./type.js"
import {Ast} from "../types/ast.js"
import {Stack} from "../utils/stack.js"
import {packValue} from "./pack-value.js"
import {Clocks} from "../../utils/timekeep.js"
import {processArray} from "./process-array.js"
import {Dictionary} from "../utils/dictionary.js"
import {processObject} from "./process-object.js"

export function processNode(
		node: any,
		stack: Stack,
		dictionary: Dictionary,
		pushResult: (r: string) => void,
		clocks: Clocks,
	) {

	switch (type(node)) {

		case Ast.Type.Primitive:
			clocks.primitives(() => {
				pushResult(packValue(node))
			})
			break

		case Ast.Type.Array:
			clocks.arrays(() => {
				processArray(stack, node)
			})
			break

		case Ast.Type.Object:
			clocks.objects(() => {
				processObject(stack, dictionary, node)
			})
			break

		default:
			throw new Error("unknown type")
	}
}
