
import {Stage} from "../../stage/stage.js"

export type MenuItem = {
	name: string
	panel: ({}: {stage: Stage}) => any
}

export function menu<P>(name: string, panel: ({}: {stage: Stage}) => P): MenuItem {
	return {name, panel}
}

