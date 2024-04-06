

import {Suite, assert} from "cynic"
import {nametag} from "./nametag.js"

export default {

	async "name"() {
		assert(nametag("").name === "")
		assert(nametag("chase").name === "chase")
	},

	async "tags"() {
		assert(nametag("::cool").has("cool") === true)
		assert(nametag("::cool").get("cool") === null)
		assert(nametag("::cool=abc").get("cool") === "abc")
		assert(nametag("::cool=abc=123").get("cool") === "abc=123")
		assert(nametag("::").has("") === false)
		assert(nametag("::=abc").size === 0)
		assert(nametag("::=").size === 0)

		assert(nametag("::cool::lol").size === 2)
		assert(nametag("::cool=1::lol=2").size === 2)
	},

	async "meta"() {
		assert(nametag("").meta === null)
		assert(nametag(".").meta === "")
		assert(nametag(".001").meta === "001")
		assert(nametag(".lol.001").meta === "lol.001")
	},

	async "wacky"() {
		{
			const x = nametag("::cool::lol.rofl.001")
			assert(x.name === "")
			assert(x.size === 2)
			assert(x.meta === "rofl.001")
		}
		{
			const x = nametag("chase::cool::lol.rofl.001")
			assert(x.name === "chase")
			assert(x.size === 2)
			assert(x.meta === "rofl.001")
		}
		{
			const x = nametag("chase.wasd::cool::lol.rofl.001")
			assert(x.name === "chase")
			assert(x.size === 0)
			assert(x.meta?.length)
		}
	},

} satisfies Suite

