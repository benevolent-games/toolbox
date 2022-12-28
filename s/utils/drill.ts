
import {isVoid} from "./is-void.js"

/**
 * drill into an object/array tree and obtain a value
 */
export function drill<xResult>(
		object: {[key: string]: any} | any[],
		path: (string | number)[],
	): xResult {

	let current: any = object

	for (const key of path) {
		current = current[key]
		if (isVoid(current))
			break
	}

	return current
}
