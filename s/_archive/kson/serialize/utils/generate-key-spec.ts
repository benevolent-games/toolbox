
import {controls} from "../../text/controls.js"
import {Dictionary} from "../../utils/dictionary.js"

export function generateKeySpec(
		dictionary: Dictionary
	) {

	const keys = dictionary.getKeyMapEntries()

	return keys
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
}
