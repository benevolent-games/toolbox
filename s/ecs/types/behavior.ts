
import {Controls} from "./controls.js"

export interface Behavior<C extends {}, A extends keyof C> {
	name: string
	needs: A[]
	action: (
		c: {[P in A]: C[P]} & Partial<C>,
		controls: Controls<C>
	) => void
}
