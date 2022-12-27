
import {controls} from "./text/controls.js"
import {setupKeyMap} from "./utils/setup-key-map.js"

/*

{DATA}

(open)(array)
	(open)(object)
		{ID}(pair){DATA}
			(item)
		{ID}(pair)(open)(array)
			{DATA}
				(item)
			{DATA}
		(close)
	(close)
(close)

*/

export function serialize(data: any) {
	const {getKeyId, getKeyMapEntries} = setupKeyMap()
	let cycles = 0
	let deepest = 0

	function recurse(data: any, depth: number) {
		cycles++
		if (depth > deepest)
			deepest = depth

		const results: string[] = []
		const isArray = Array.isArray(data)
		const isObject = typeof data === "object" && !!data

		if (isArray) {
			results.push(
				controls.open,
				controls.array,

				...data.flatMap((value, index) => {
					const items = recurse(value, depth + 1)
					if (index !== (data.length - 1))
						items.push(controls.itemsep)
					return items
				}),

				controls.close,
			)
		}

		else if (isObject) {
			const entries = Object.entries(data)

			results.push(
				controls.open,
				controls.object,

				...entries.flatMap(([key, value], index) => {
					const last: string[] = (index === (entries.length - 1))
						? []
						: [controls.itemsep]
					return [
						JSON.stringify(getKeyId(key)),
						controls.pairsep,
						...recurse(value, depth + 1),
						...last,
					]
				}),

				controls.close,
			)
		}

		else {
			results.push(JSON.stringify(data))
		}

		return results
	}

	const payload = recurse(data, 0).join("")
	const keys = getKeyMapEntries()
	const keyspec = keys
		.map(([key, id], index) => [
			key,
			controls.pairsep,
			JSON.stringify(id),
			...(index === (keys.length - 1))
				? []
				: [controls.itemsep],
		])
		.flat()
		.join("")

	console.log("cycles", cycles)
	console.log("deepest", deepest)

	return keyspec
		+ controls.payloadsep
		+ payload
}
