
import {expect, Suite} from "cynic"

import {range} from "../range.js"
import {serialize} from "./serialize.js"

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
	async "serialize some data"() {
		const data = testData.entities(1000)
		const text = serialize(data)
		const json = JSON.stringify(data)
		// const vis = visualize(text)
		expect(text.length > 1).ok()
		expect(text.length < json.length).ok()
	},
}
