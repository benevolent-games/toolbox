
import {assert, Suite} from "cynic"

import {range} from "../utils/range.js"
import {threadedSerializer} from "./serialize/threaded.js"
import {serializeBlockingly} from "./serialize/blocking.js"
import {serializeProgressively} from "./serialize/progressive.js"

const testData = {
	entities: (n: number) => range(n).map(() => ({
		health: 1,
		hydration: 1,
		nourishment: 1,
		position: [1, 2, 3],
		personality: {
			openness: 1,
			neuroticism: 1,
			extroversion: 1,
			agreeableness: 1,
			conscientiousness: 1,
		},
	})),
}

export default <Suite>{
	async "serialize data"() {
		const data = testData.entities(100)
		const json = JSON.stringify(data)

		function assertions(text: string) {
			assert(text.length > 1, "text has length")
			assert(text.length < json.length, "smaller than json")
		}

		return {
			blocking: async() => assertions(serializeBlockingly(data)),
			progressive: async() => assertions(serializeProgressively(data)),
			threaded: async() => {
				const serializer = await threadedSerializer()
				const text = await serializer.serialize(data)
				serializer.terminate()
				assertions(text)
			},
		}
	},
}
