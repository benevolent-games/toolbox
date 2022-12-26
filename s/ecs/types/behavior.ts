
import {Controls} from "./controls.js"
import {Duration} from "../../chronicler/utils/gametime.js"

export interface Behavior<C extends {}, A extends keyof C> {
	name: string
	needs: A[]
	frequency: (duration: Duration) => number
	action: (
		c: {[P in A]: C[P]} & Partial<C>,
		controls: Controls<C>
	) => void
}
