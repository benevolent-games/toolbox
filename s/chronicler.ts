
import {ecs} from "./ecs.js"
import {human} from "./utils/human.js"
import {repeat} from "./utils/repeat.js"
import {r, seed} from "./utils/randomly.js"
import {Traits} from "./chronicler/traits.js"
import {timekeeper} from "./utils/timekeeper.js"
import {serialize} from "./kson/serialize.js"
import {behaviors} from "./chronicler/behaviors.js"
import {archetypes} from "./chronicler/archetypes.js"
import {durationSpec} from "./chronicler/durations.js"
import {setupTimeline} from "./chronicler/utils/gametime.js"

const config = {
	people: 10_000,
	steps: 60,
}

const {clocks, report} = timekeeper()

const clock_init = clocks.init
const random = seed(1)
const randomly = r(random)
const timeline = setupTimeline(durationSpec)
const e = ecs<Traits>(behaviors, timeline)
clock_init()

const clock_setup = clocks.setup
const make = archetypes({randomly})
repeat(config.people, () => e.add(make.person()))
e.add(make.hut())
e.add(make.hut())
clock_setup()

const clock_simulation = clocks.simulation
repeat(
	config.steps,
	() => e.execute({timeDelta: timeline.duration.seconds(1)}),
)
clock_simulation()

const clock_queries = clocks.queries
const people = e.select(["identity"])
const alive = people
	.filter(([id, components]) => !components.death)
const dead = people
	.filter(([id, components]) => !!components.death)
clock_queries()


console.log(`alive ${alive.length}`)
console.log(`dead ${dead.length}`)

const clock_arrayize = clocks.arrayize
const payload = [...e.entities.entries()]
clock_arrayize()

const clock_json = clocks.json
const json = JSON.stringify(payload)
clock_json()

const clock_kson = clocks.kson
const kson = await serialize(payload, {
	onProgress(stats) {
		const megs = human.megabytes(stats.bytes)
		const mill = human.millions(stats.cycles)
		console.log(`serialize - ${megs}, cycles ${mill}`)
	}
})
clock_kson()

console.log("json", human.megabytes(json.length))
console.log("kson", human.megabytes(kson.length))
console.log("savings", human.percent(1 - (kson.length / json.length)))

e.timekeep.report()
report()
