
import {register_to_dom} from "@benev/slate"

import {hub} from "./ecs/hub.js"
import {nexus} from "./nexus.js"
import {loop2d} from "../tools/loopy.js"
import {renderizer} from "./ecs/systems/render.js"
import {BenevIso} from "./dom/elements/benev-iso/element.js"

register_to_dom({BenevIso})

const {base} = nexus.context

for (const [x, y] of loop2d([4, 4]))
	base.entities.create({tile: "cube", position: [x, y, 0]})

const executor = hub.executor(base, base.entities, [
	renderizer,
])

let tick = 0

function tickloop() {
	tick += 1
	executor.execute_all_systems({tick})
	requestAnimationFrame(tickloop)
}

tickloop()

console.log("iso")

