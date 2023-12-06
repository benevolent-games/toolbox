
import {type} from "../utils/type.js"
import {Ast} from "../../types/ast.js"
import {processArray} from "./array.js"
import {processObject} from "./object.js"
import {Stack} from "../../utils/stack.js"
import {packValue} from "../utils/pack-value.js"
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
