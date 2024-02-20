
import {Stage} from "../../stage/stage.js"

export type MenuItem = {
	name: string
	panel: ({}: {stage: Stage}) => any
}

