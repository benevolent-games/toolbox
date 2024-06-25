
import {Suite} from "cynic"
import "@benev/slate/x/node.js"

import ecs4 from "./ecs/ecs4.test.js"
import ecs5 from "./ecs/ecs5.test.js"
import nametag from "./tools/nametag/nametag.test.js"

export default <Suite>{
	ecs4,
	ecs5,
	nametag,
}

