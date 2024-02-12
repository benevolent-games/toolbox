
import {Suite, expect} from "cynic"
import {Quat} from "../math/quat.js"
import {Vec3} from "../math/vec3.js"
import {Component, Entity, Hub, World} from "./ecs5.js"

type MyBase = {}
type MyTick = {}
const hub = new Hub<MyBase, MyTick>()
const {system, behavior} = hub

class Counter extends Component<number> {}
class Position extends Component<Vec3> {}
class Rotation extends Component<Quat> {}

export default <Suite>{
	"manually change values": async() => {
		const world = new World()
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
		const world = new World()
		const executive = hub.executive({}, world, system("testing root", [
			behavior("increase counter")
				.select({Counter})
				.act(() => components => {
					components.counter++
				}),
		]))

		const [id, data] = world.create({Counter}, {counter: 0})
		expect(data.counter).equals(0)

		executive.execute({})
		expect(data.counter).equals(1)
	},
}

