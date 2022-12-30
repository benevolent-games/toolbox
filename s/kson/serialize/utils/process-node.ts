
import {type} from "./../type.js"
import {Ast} from "../../types/ast.js"
import {packValue} from "./pack-value.js"
import {Stack} from "../../utils/stack.js"
import {processArray} from "./process-array.js"
import {processObject} from "./process-object.js"
import {Dictionary} from "../../utils/dictionary.js"

export function processNode(
		node: any,
		stack: Stack,
		dictionary: Dictionary,
		pushResult: (r: string) => void,
	) {

	switch (type(node)) {

		case Ast.Type.Primitive:
			pushResult(packValue(node))
			break

		case Ast.Type.Array:
			processArray(stack, node)
			break

		case Ast.Type.Object:
			processObject(stack, dictionary, node)
			break

		default:
			throw new Error("unknown type")
	}
}
