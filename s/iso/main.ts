
import {register_to_dom} from "@benev/slate"

import {nexus} from "./nexus.js"
import {Core} from "../core/core.js"
import {loop2d} from "../tools/loopy.js"
import {render_system} from "./ecs/systems/render.js"
import {BenevIso} from "./dom/elements/benev-iso/element.js"

register_to_dom({BenevIso})

console.log("iso")

const {hub} = nexus.context

for (const [x, y] of loop2d([4, 4]))
	hub.entities.create({tile: "cube", position: [x, y, 0]})

const executor = new Core.Executor(hub, [
	render_system,
])

let tick = 0

function tickloop() {
	tick += 1
	executor.tick({tick})
	requestAnimationFrame(tickloop)
}

tickloop()

