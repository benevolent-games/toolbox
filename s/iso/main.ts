
import {register_to_dom} from "@benev/slate"

import {house} from "./ecs/house.js"
import {Core} from "../core/core.js"
import {loop2d} from "../tools/loopy.js"
import {renderSystem} from "./ecs/systems/render.js"
import {BenevIso} from "./dom/elements/benev-iso/element.js"

register_to_dom({BenevIso})

console.log("iso")

for (const [x, y] of loop2d([4, 4]))
	house.entities.create({tile: "cube", position: [x, y, 0]})

const executor = new Core.Executor({entities: house.entities}, [
	renderSystem,
])

let tick = 0

function tickloop() {
	tick += 1
	executor.tick({tick})
	requestAnimationFrame(tickloop)
}

tickloop()

