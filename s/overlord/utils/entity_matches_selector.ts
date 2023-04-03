
import {Rec} from "../types.js"

export function entity_matches_selector(state: Rec, selector: string[]) {
	return selector.every(s => state.hasOwnProperty(s))
}
