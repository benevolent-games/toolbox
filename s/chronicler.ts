
import {ecs} from "./ecs.js"
import {timer} from "./utils/timer.js"
import {repeat} from "./utils/repeat.js"
import {r, seed} from "./utils/randomly.js"
import {Traits} from "./chronicler/traits.js"
import {serialize} from "./utils/kson/serialize.js"
import {behaviors} from "./chronicler/behaviors.js"
import {archetypes} from "./chronicler/archetypes.js"
import {durationSpec} from "./chronicler/durations.js"
import {setupTimeline} from "./chronicler/utils/gametime.js"

const config = {
	people: 10_000,
	steps: 10,
}

const bigtimer = timer("everything")

const timer_init = timer("init")
const random = seed(1)
const randomly = r(random)
const timeline = setupTimeline(durationSpec)
const e = ecs<Traits>(behaviors, timeline)
timer_init.report()

const t1 = timer("setup")
const stopclock = e.timekeep.clocks.setup
const make = archetypes({randomly})
repeat(config.people, () => e.add(make.person()))
e.add(make.hut())
e.add(make.hut())
stopclock()
t1.report()

const t2 = timer("simulate behaviors")
repeat(config.steps, () => e.execute({timeDelta: timeline.duration.seconds(1)}))
t2.report()

const t3 = timer("queries")
const people = e.select(["identity"])

const alive = people
	.filter(([id, components]) => !components.death)

const dead = people
	.filter(([id, components]) => !!components.death)

t3.report()

e.timekeep.report()

console.log(`alive ${alive.length}`)
console.log(`dead ${dead.length}`)

const payload = [...e.entities.entries()]
const json = JSON.stringify(payload)
const kson = serialize(payload)

function megabytes(bytes: number) {
	return `${(bytes / 1_000_000).toFixed(2)} MB`
}

function percent(fraction: number) {
	return `${(fraction * 100).toFixed(0)}%`
}

console.log("json", megabytes(json.length))
console.log("kson", megabytes(kson.length))
console.log("savings", percent(1 - (kson.length / json.length)))

bigtimer.report()
