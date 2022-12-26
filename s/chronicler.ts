
import {ecs} from "./ecs.js"
import {timer} from "./utils/timer.js"
import {repeat} from "./utils/repeat.js"
import {r, seed} from "./utils/randomly.js"
import {Traits} from "./chronicler/traits.js"
import {behaviors} from "./chronicler/behaviors.js"
import {archetypes} from "./chronicler/archetypes.js"
import {setupTimeline} from "./chronicler/utils/gametime.js"

const bigtimer = timer("everything")

const timer_init = timer("init")
const random = seed(1)
const randomly = r(random)
const e = ecs<Traits>(behaviors, setupTimeline(compactTime))
timer_init.report()

const t1 = timer("setup")
const stopclock = e.timekeep.clocks.setup
const make = archetypes({randomly})
repeat(1000, () => e.add(make.person()))
e.add(make.hut())
e.add(make.hut())
stopclock()
t1.report()

const t2 = timer("simulate behaviors")
repeat(1000, () => e.execute({timeDelta: 1}))
t2.report()

const t3 = timer("queries")
const people = e.select(["identity"])

const alive = people
	.filter(([id, components]) => !components.death)

const dead = people
	.filter(([id, components]) => !!components.death)

// const peopleWithAHome = people
// 	.filter(([id, {home}]) => !!home?.structureId)
t3.report()

e.timekeep.report()

console.log(`alive ${alive.length}`)
console.log(`dead ${dead.length}`)
// console.log(`homed ${peopleWithAHome.length}`)

// for (const [,{death, identity}] of dead)
// 	console.log(` - "${identity?.birthname}", cause of death: ${death?.cause}`)


bigtimer.report()
