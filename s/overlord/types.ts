
export type Rec = Record<string, unknown>

export type Action<
	S extends Rec,
	K extends keyof S,
	L,
> = ({}: {state: Pick<S, K>, local: L, id: number}) => void

export type Activity = [Frequency, Action<any, any, any>]

export type Behavior<
		S extends Rec = any,
		K extends keyof S = any,
		L = any,
	> = {
	name: string
	selector: K[]
	create: ({}: {state: Pick<S, K>, id: number}) => L
	delete: ({}: {state: Pick<S, K>, local: L, id: number}) => void
	activity?: [Frequency, Action<S, K, L>]
}

export type BehaviorArrayMaker<S extends Rec> = (
	(b: (name: string) => BehaviorMaker<S>) => Behavior[]
)

export type BehaviorMaker<S extends Rec> = {
	selector: <K extends keyof S>(...selector: K[]) => {

		lifecycle: <L extends Rec = any>({}: {
			create: ({}: {state: Pick<S, K>, id: number}) => L
			delete: ({}: {state: Pick<S, K>, local: L, id: number}) => void
			activity?: [Frequency, Action<S, K, L>]
		}) => Behavior<S, K>

		activity: (f: Frequency, a: Action<S, K, void>) => Behavior<S, K>
	}
}

export enum Frequency {
	High,
	Medium,
	Low,
}

export type Freq<T> = {
	high: T
	medium: T
	low: T
}

export type OverlordParams<S extends Rec> = {
	behaviors: Behavior<S, keyof S>[]
	frequencies: Freq<number>
}

export type EntityCallbacks<S extends Rec> = {
	on_add(id: number, state: Partial<S>): void
	on_delete(id: number, state: Partial<S>): void
}

export type EntityPattern<S extends Rec> = [
	S,
	(state: S) => void,
]
