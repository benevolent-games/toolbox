

import {Suite, expect} from "cynic"
import {nametag} from "./nametag.js"

export default {

	async "we can parse name"() {
		expect(nametag("").name).equals("")
		expect(nametag("chase").name).equals("chase")
	},

	async "we can parse tags"() {
		expect(nametag("::cool").has("cool")).equals(true)
		expect(nametag("::cool").get("cool")).equals(true)
		expect(nametag("::cool=").get("cool")).equals(true)
		expect(nametag("::cool=abc").get("cool")).equals("abc")
		expect(nametag("::cool=abc=123").get("cool")).equals("abc=123")
		expect(nametag("::").has("")).equals(false)
		expect(nametag("::=abc").size).equals(0)
		expect(nametag("::=").size).equals(0)
		expect(nametag("::cool::lol").size).equals(2)
		expect(nametag("::cool=1::lol=2").size).equals(2)
	},

	async "we can parse meta"() {
		expect(nametag("").meta).equals(null)
		expect(nametag(".").meta).equals("")
		expect(nametag(".001").meta).equals("001")
		expect(nametag(".lol.001").meta).equals("lol.001")
	},

	async "we can parse wacky mixtures of stuff"() {
		{
			const x = nametag("::cool::lol.rofl.001")
			expect(x.name).equals("")
			expect(x.size).equals(2)
			expect(x.meta).equals("rofl.001")
		}
		{
			const x = nametag("chase::cool::lol.rofl.001")
			expect(x.name).equals("chase")
			expect(x.size).equals(2)
			expect(x.meta).equals("rofl.001")
		}
		{
			const x = nametag("chase.wasd::cool::lol.rofl.001")
			expect(x.name).equals("chase")
			expect(x.size).equals(0)
			expect(x.meta?.length)
		}
	},

	async "we can construct new nametags"() {
		expect(nametag("").toString()).equals("")
		expect(nametag("chase").toString()).equals("chase")
		expect(nametag("chase::cool::lod=2.001").toString()).equals( "chase::cool::lod=2.001")
		{
			const x = nametag("")
			x.name = "chase"
			x.set("cool", true)
			x.set("lod", "2")
			x.meta = "001"
			expect(x.toString()).equals("chase::cool::lod=2.001")
		}
		{
			const x = nametag("")
			x.name = "chase"
			x.set("cool", "") // empty string equates to true
			x.set("lod", "2")
			x.meta = "001"
			expect(x.toString()).equals("chase::cool::lod=2.001")
		}
	},

} satisfies Suite

