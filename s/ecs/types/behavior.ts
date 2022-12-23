
export interface Behavior<C extends {}, A extends keyof C> {
	name: string
	needs: A[]
	action: (
		c: {[P in A]: C[P]} & Partial<C>,
		controls: any
	) => void
}
