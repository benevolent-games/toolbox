
import {Suite, expect} from "cynic"
import {Quat} from "../math/quat.js"
import {Vec3} from "../math/vec3.js"
import {Component, Entity, Hub, HybridComponent, World} from "./ecs5.js"

type MyBase = {}
type MyTick = {}
const hub = new Hub<MyBase, MyTick>()
const {system, behavior} = hub

class Counter extends Component<number> {}
class Position extends Component<Vec3> {}
class Rotation extends Component<Quat> {}

export default <Suite>{
	"manually change values": async() => {
		const world = new World({})
		const [id, data1] = world.create({Counter}, {counter: 0})

		expect(data1.counter).equals(0)
		data1.counter = 1
		expect(data1.counter).equals(1)

		const data2 = world.get(id, {Counter})
		expect(data2.counter).equals(1)

		data2.counter = 2
		expect(data1.counter).equals(2)
		expect(data2.counter).equals(2)
	},

	"counting behavior": async() => {
		const world = new World({})
		const executive = hub.executive({}, world, system("testing root", [
			behavior("increase counter")
				.select({Counter})
				.act(() => components => {
					components.counter++
				}),
		]))

		const [,data] = world.create({Counter}, {counter: 0})
		expect(data.counter).equals(0)

		executive.execute({})
		expect(data.counter).equals(1)
	},

	"behavior composition": async() => {
		const world = hub.world({})
		const executive = hub.executive({}, world, system("testing root", [
			behavior("increase counter")
				.select({Counter})
				.act(() => components => {
					components.counter++
				}),
			system("subsystem", [
				behavior("double decrease counter")
					.select({Counter})
					.act(() => components => {
						components.counter -= 2
					}),
			]),
		]))

		const [,data] = world.create({Counter}, {counter: 0})
		expect(data.counter).equals(0)

		executive.execute({})
		expect(data.counter).equals(-1)
	},

	"basic lifecycle": async() => {
		class Base { doubler = 2 }
		class Tick { tripler = 3 }

		let deleted_was_called = 0

		class Tester extends HybridComponent<Base, {a: number}> {
			get b() { return this.base.doubler * this.state.a }
			init() {}
			deleted() { deleted_was_called++ }
		}

		const hub = new Hub<Base, Tick>()
		const base = new Base()
		const world = hub.world(base)
		const {system, behavior} = hub

		const executive = hub.executive(base, world, system("testing", [
			behavior("increment a")
				.select({Tester})
				.act(() => components => {
					components.tester.state.a++
				}),
		]))

		const [id, data] = world.create({Tester}, {tester: {a: 1}})
		expect(data.tester.state.a).equals(1)
		expect(data.tester.b).equals(2)
		expect(deleted_was_called).equals(0)

		executive.execute(new Tick())
		expect(data.tester.state.a).equals(2)
		expect(data.tester.b).equals(4)
		expect(deleted_was_called).equals(0)

		world.delete(id)
		expect(deleted_was_called).equals(1)
	},
}

