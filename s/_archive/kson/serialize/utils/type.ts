
import {Ast} from "../../types/ast.js"

export function type(data: any): Ast.Type {
	const isArray = Array.isArray(data)
	const isObject = typeof data === "object" && !!data

	return isObject
		? isArray
			? Ast.Type.Array
			: Ast.Type.Object
		: Ast.Type.Primitive
}
