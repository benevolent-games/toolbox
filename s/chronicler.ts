
import {ecs} from "./ecs.js"
import {human} from "./utils/human.js"
import {repeat} from "./utils/repeat.js"
import {r, seed} from "./utils/randomly.js"
import {Timekeep} from "./utils/timekeep.js"
import {Traits} from "./chronicler/traits.js"
import {makeSerializer, Serializer} from "./kson/serialize.js"
import {behaviors} from "./chronicler/behaviors.js"
import {archetypes} from "./chronicler/archetypes.js"
import {durationSpec} from "./chronicler/durations.js"
import {setupTimeline} from "./chronicler/utils/gametime.js"

const config = {
	people: 10_000,
	steps: 60,
}

const timekeepAll = new Timekeep("👐")
const TIMER_CHRONICLER = timekeepAll.timers.chronicler
const timekeep = new Timekeep("📜")

const TIMER_INIT = timekeep.timers.init
const random = seed(1)
const randomly = r(random)
const timeline = setupTimeline(durationSpec)
const e = ecs<Traits>(behaviors, timeline)
TIMER_INIT()

const TIMER_SETUP = timekeep.timers.setup
const make = archetypes({randomly})
repeat(config.people, () => e.add(make.person()))
e.add(make.hut())
e.add(make.hut())
TIMER_SETUP()

const TIMER_SIMULATION = timekeep.timers.simulation
repeat(
	config.steps,
	() => e.execute({timeDelta: timeline.duration.seconds(1)}),
)
TIMER_SIMULATION()

const TIMER_QUERIES = timekeep.timers.queries
const people = e.select(["identity"])
const alive = people
	.filter(([id, components]) => !components.death)
const dead = people
	.filter(([id, components]) => !!components.death)
TIMER_QUERIES()


console.log(`alive ${alive.length}`)
console.log(`dead ${dead.length}`)

const TIMER_ARRAYIZE = timekeep.timers.arrayize
const payload = [...e.entities.entries()]
TIMER_ARRAYIZE()

const TIMER_JSON = timekeep.timers.json
const json = JSON.stringify(payload)
TIMER_JSON()

const serializer = await makeSerializer()
// const serializer = new Serializer()

const TIMER_KSON = timekeep.timers.kson
// const kson = serialize(payload, {
// 	onProgress({bytes, cycles}) {
// 		const megs = human.megabytes(bytes)
// 		const mill = `${cycles} (${human.millions(cycles)})`
// 		console.log(`serialize - ${megs}, cycles ${mill}`)
// 	}
// })
// const kson = oldSerializer(payload)
const kson = await serializer.serialize(payload)
serializer.terminate()
TIMER_KSON()

console.log("json", human.megabytes(json.length))
console.log("kson", human.megabytes(kson.length))
console.log("savings", human.percent(1 - (kson.length / json.length)))

TIMER_CHRONICLER()
timekeep.report()
timekeepAll.report()

// console.log((kson))

// e.timekeep.report()
// report()
