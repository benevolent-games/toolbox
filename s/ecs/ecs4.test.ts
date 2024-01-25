
import {Ecs4} from "./ecs4.js"
import {Suite, expect} from "cynic"

function testHub() {
	type MyBase = {}
	type MyTick = {}
	type MySchema = {
		alpha: number
		bravo: number
	}
	return new Ecs4.Hub<MyBase, MyTick, MySchema>()
}

export default <Suite>{
	"ecs4": async() => {
		const {system, behavior, setup} = testHub()
		const systems = system("test system", () => [
			behavior("increase alpha")
				.query("alpha")
				.processor(() => state => {
					state.alpha += 1
				}),
		])
		const {entities, executor} = setup({}, systems)
		const id = entities.create({alpha: 0})
		expect(entities.get(id).alpha).equals(0)
		executor.execute({})
		expect(entities.get(id).alpha).equals(1)
	},
}

