
import {Pojo, Pub, ob, pub} from "@benev/slate"
import {measure} from "../tools/measure.js"
import {id_counter} from "../tools/id_counter.js"

export namespace Ecs3 {
	export type Id = number
	export type Schema = Record<string, any>
	export type AsSchema<Sc extends Schema> = Sc
	export type Query<Sc extends Schema> = (keyof Sc)[]
	export type Select<Sc extends Schema, Q extends Query<Sc>> = {[P in Q[number]]: Sc[P]}
	export type Entry<State> = [Id, State]

	export type Passes<Sc extends Schema> = Record<string, Pass<Sc, Query<Sc>>>
	export type Selections<Sc extends Schema, P extends Passes<Sc>> = {
		[K in keyof P]: Entry<Select<Sc, P[K]["query"]>>[]
	}
	export type Exe<Tick, Sc extends Schema, P extends Passes<Sc>> = (tick: Tick, selections: Selections<Sc, P>) => void

	export namespace Events {
		export type Payloads<State> = {
			created: [Id, State]
			updated: [Id, State]
			deleted: Id
		}

		export type Pubs<State> = {
			[P in keyof Payloads<State>]: Pub<Payloads<State>[P]>
		}

		export type Fns<State> = {
			[P in keyof Payloads<State>]: (p: Payloads<State>[P]) => void
		}

		export const noops: Fns<Schema> = Object.freeze({
			created: () => {},
			updated: () => {},
			deleted: () => {},
		})
	}

	export class Pass<Sc extends Schema, Q extends Query<Sc>> {
		constructor(
			public query: Q,
			public events: Events.Fns<Select<Sc, Q>>,
		) {}
	}

	export class Executable<Tick, Sc extends Schema, P extends Passes<Sc>> {
		constructor(
			public name: string,
			public passes: P,
			public exe: Exe<Tick, Sc, P>,
		) {}
	}

	export type QuickPass<Sc extends Schema> = (
		<Q extends Query<Sc>>({}: {
			query: Q
			events?: Events.Fns<Select<Sc, Q>>
		}) => Pass<Sc, Q>
	)

	export type Ret<Tick, Sc extends Schema> = {
		pass: QuickPass<Sc>,
		passes: <P extends Passes<Sc>>(passes: P) => {
			exe: (exe: Exe<Tick, Sc, P>) => Executable<Tick, Sc, P>
		}
	}

	export namespace Fns {
		export type Processor<Base, Tick, Sc extends Schema, Q extends Query<Sc>> = (
			(base: Base) => (tick: Tick) => (state: Select<Sc, Q>, id: Id) => void
		)
		export type Multi<Base, Tick, Sc extends Schema, P extends Passes<Sc>, E extends Exe<Tick, Sc, P>> = (
			(base: Base) => {
				passes: P
				exe: E
			}
		)
		export type Complex<Base, Tick, Sc extends Schema> = (
			(base: Base) => (ret: Ret<Tick, Sc>) => Executable<Tick, Sc, any>
		)
	}

	export class Hub<Base, Tick, Sc extends Schema> {
		pass: QuickPass<Sc> = (
			({query, events = Events.noops}) =>
				new Pass(query, events)
		)

		behavior = (name: string) => ({
			complex: (fn: Fns.Complex<Base, Tick, Sc>) => (base: Base) => fn(base)({
				pass: this.pass,
				passes: passes => ({
					exe: exe => new Executable(name, passes, exe),
				}),
			}),

			select: <Q extends Query<Sc>>(...query: Q) => ({
				processor: (fn: Fns.Processor<Base, Tick, Sc, Q>) => (base: Base) => {
					const fn2 = fn(base)

					const passes = {
						only: new Pass<Sc, Q>(query, Events.noops)
					} satisfies Passes<Sc>

					return new Executable<Tick, Sc, typeof passes>(
						name,
						passes,
						(tick, selections) => {
							const fn3 = fn2(tick)
							for (const [id, state] of selections.only)
								fn3(state, id)
						},
					)
				}
			}),
		})
	}
}

/////////////////////////////
/////////////////////////////

type MyBase = {}
type MyTick = {}
type MySchema = Ecs3.AsSchema<{
	alpha: number
	bravo: boolean
	charlie: string
}>

const hub = new Ecs3.Hub<MyBase, MyTick, MySchema>()

const lol = (hub
	.behavior("lol")
	.select("alpha", "bravo")
	.processor(base => tick => state => {
		state.alpha
		state.bravo
	})
)

const lol2 = (hub
	.behavior("rofl")
	.complex(base => ({passes, pass}) => {
		let map = new Map()
		return passes({
			alphas: pass({
				query: ["alpha"],
				events: Ecs3.Events.noops,
			}),
			others: pass({
				query: ["bravo", "charlie"],
				events: {
					created: ([id, state]) => {
						state.bravo
					},
					updated: () => {},
					deleted: () => {},
				},
			}),
		}).exe((tick, selections) => {
			selections.alphas
			// selections.thisShouldFail
		})
	})
)



















































































































































































