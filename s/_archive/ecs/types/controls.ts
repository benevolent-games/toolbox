
import {Gametime} from "../../chronicler/utils/gametime.js"

export interface Controls<C extends {}> {

	readonly id: number
	readonly gametime: Gametime

	write: (id: number, changes: Partial<C>) => void

	select: (
		<A extends keyof C>(
			selectors: A[],
			filter?: (c: {[P in A]: C[P]} & Partial<C>) => boolean,
			not?: number,
		) => [number, {[P in A]: C[P]} & Partial<C>][]
	)
}
