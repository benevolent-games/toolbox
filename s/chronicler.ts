
import {ecs} from "./ecs.js"
import {timer} from "./utils/timer.js"
import {repeat} from "./utils/repeat.js"
import {r, seed} from "./utils/randomly.js"
import {makers} from "./chronicler/makers.js"
import {behaviors} from "./chronicler/behaviors.js"
import {Components} from "./chronicler/components.js"

const bigtimer = timer("everything")

const timer_init = timer("init")
const random = seed(1)
const randomly = r(random)
const e = ecs<Components>(behaviors)
timer_init.report()

const t1 = timer("setup")
const make = makers(randomly)
repeat(1_000, () => e.add(make.person()))
e.add(make.hut())
e.add(make.hut())
t1.report()

const t2 = timer("system execution")
repeat(1_000, () => e.execute())
t2.report()

const t3 = timer("queries")
const people = e.query(c => !!c.identity)

const alive = people
	.filter(([id, components]) => !components.death)

const dead = people
	.filter(([id, components]) => !!components.death)

const peopleWithAHome = people
	.filter(([id, {home}]) => !!home?.structureId)
t3.report()

e.timers.matching.report()
e.timers.executing.report()

console.log(`alive ${alive.length}`)
console.log(`dead ${dead.length}`)
console.log(`homed ${peopleWithAHome.length}`)

for (const [,{death, identity}] of dead)
	console.log(` - "${identity?.birthname}", cause of death: ${death?.cause}`)


bigtimer.report()
