
import {Ecs4} from "./ecs4.js"
import {is} from "@benev/slate"
import {Suite, expect, assert} from "cynic"

type MyBase = {}
type MyTick = {}
type MySchema = {alpha: number, bravo: number}
type MyHub = Ecs4.Hub<MyBase, MyTick, MySchema>
type MyPreSystem = Ecs4.PreSystem<MyBase, MyTick, MySchema>

function testSetup(fn: (hub: MyHub) => MyPreSystem) {
	const hub = new Ecs4.Hub<MyBase, MyTick, MySchema>()
	const base: MyBase = {}
	const entities = hub.entities()
	const executor = hub.executor(base, entities, fn(hub))
	return {entities, executor}
}

export default <Suite>{
	"basic processor": async() => {
		const {entities, executor} = testSetup(({system, behavior}) => (
			system("test system", () => [
				behavior("increase alpha")
					.select("alpha")
					.processor(() => () => state => state.alpha += 1),
			])
		))
		const id = entities.create({alpha: 0})
		expect(entities.get(id).alpha).equals(0)
		executor.execute({})
		expect(entities.get(id).alpha).equals(1)
	},

	"behavior composition": async() => {
		const {entities, executor} = testSetup(({system, behavior}) => {
			const subsystem = system("test subsystem", () => [
				behavior("bravo")
					.select("bravo")
					.processor(() => () => state => state.bravo += 1)
			])
			return system("test system", () => [
				behavior("increase alpha")
					.select("alpha")
					.processor(() => () => state => {
						state.alpha += 1
					}),
				subsystem,
			])
		})
		const id = entities.create({alpha: 0, bravo: 0})
		expect(entities.get(id).alpha).equals(0)
		expect(entities.get(id).alpha).equals(0)
		executor.execute({})
		expect(entities.get(id).alpha).equals(1)
		expect(entities.get(id).bravo).equals(1)
	},

	"basic lifecycle": async() => {
		const {entities, executor} = testSetup(({system, behavior}) => (
			system("test system", () => [
				behavior("increase alpha")
					.select("alpha")
					.lifecycle(() => () => {
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
		))

		const counts = {starts: 0, ticks: 0, ends: 0}
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
		const {entities, executor} = testSetup(({system, behavior}) => (
			system("test system", () => [
				behavior("increase alpha")
					.select("alpha")
					.lifecycle(() => () => {
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
		))

		const counts = {starts: 0, ticks: 0, ends: 0}
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

	"diagnostics": async() => {
		const {entities, executor} = testSetup(({system, behavior}) => (
			system("test system", () => [
				behavior("increase alpha")
					.select("alpha")
					.processor(() => () => state => state.alpha += 1),
			])
		))
		entities.create({alpha: 0})
		executor.execute({})
		assert(executor.diagnostics.size > 0)
		assert(is.number(executor.diagnostics.get(executor.system)!.average))
		assert(is.number(executor.diagnostics.get(executor.system.units[0])!.average))
	},
}

