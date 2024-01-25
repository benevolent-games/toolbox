
import {Ecs4} from "./ecs4.js"
import {Suite, expect, assert} from "cynic"

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
	"basic processor": async() => {
		const {system, behavior, setup} = testHub()
		const systems = system("test system", () => [
			behavior("increase alpha")
				.query("alpha")
				.processor(() => state => state.alpha += 1),
		])
		const {entities, executor} = setup({}, systems)
		const id = entities.create({alpha: 0})
		expect(entities.get(id).alpha).equals(0)
		executor.execute({})
		expect(entities.get(id).alpha).equals(1)
	},

	"behavior composition": async() => {
		const {system, behavior, setup} = testHub()

		const subsystem = system("test subsystem", () => [
			behavior("bravo")
				.query("bravo")
				.processor(() => state => state.bravo += 1)
		])

		const systems = system("test system", () => [
			behavior("increase alpha")
				.query("alpha")
				.processor(() => state => {
					state.alpha += 1
				}),
			subsystem,
		])

		const {entities, executor} = setup({}, systems)
		const id = entities.create({alpha: 0, bravo: 0})

		expect(entities.get(id).alpha).equals(0)
		expect(entities.get(id).alpha).equals(0)
		executor.execute({})
		expect(entities.get(id).alpha).equals(1)
		expect(entities.get(id).bravo).equals(1)
	},

	"basic lifecycle": async() => {
		const {system, behavior, setup} = testHub()
		const counts = {starts: 0, ticks: 0, ends: 0}
		const systems = system("test system", () => [
			behavior("increase alpha")
				.query("alpha")
				.lifecycle(() => {
					counts.starts += 1
					return {
						tick(_tick, state) {
							counts.ticks += 1
							state.alpha += 1
						},
						end() {
							counts.ends += 1
						},
					}
				})
		])
		const {entities, executor} = setup({}, systems)

		assert(counts.starts === 0)
		const id = entities.create({alpha: 0})
		assert(counts.starts === 1)

		assert(counts.ticks === 0)
		assert(entities.get(id).alpha === 0)

		executor.execute({})
		assert(counts.ticks === 1)
		assert(counts.ends === 0)
		assert(entities.get(id).alpha === 1)

		entities.delete(id)
		assert(counts.ends === 1)
	},

	"lifecycle reacts to component updates": async() => {
		const {system, behavior, setup} = testHub()
		const counts = {starts: 0, ticks: 0, ends: 0}
		const systems = system("test system", () => [
			behavior("increase alpha")
				.query("alpha")
				.lifecycle(() => {
					counts.starts += 1
					return {
						tick(_tick, state) {
							counts.ticks += 1
							state.alpha += 1
						},
						end() {
							counts.ends += 1
						},
					}
				})
		])
		const {entities, executor} = setup({}, systems)

		const id = entities.create({alpha: 0})
		executor.execute({})

		assert(counts.starts === 1)
		assert(counts.ticks === 1)
		assert(counts.ends === 0)

		entities.update(id, {})
		assert(counts.starts === 1)
		assert(counts.ticks === 1)
		assert(counts.ends === 1)

		entities.update(id, {alpha: 0})
		assert(counts.starts === 2)
		assert(counts.ticks === 1)
		assert(counts.ends === 1)
	},
}

