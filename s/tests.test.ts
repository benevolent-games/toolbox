
import {Suite, expect} from "cynic"

export default <Suite>{
	"empty test suite": async() => {
		expect(true).ok()
	},
}

