
import {v2} from "../../../../utils/v2.js"
import {V2} from "@benev/nubs/x/tools/v2.js"

export function cap_top_speed(force: V2, top_speed: number) {

	return (v2.magnitude(force) > top_speed)
		? v2.multiplyBy(v2.normalize(force), top_speed)
		: force
}
