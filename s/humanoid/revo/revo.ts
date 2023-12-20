
import {Pojo} from "@benev/slate"

export namespace Revo {
	type Id = number
	type GameData = [Id, string, Pojo<any>][]

	export class GameState {
		#map = new Map<Id, [string, Pojo<any>]>()

		;*loop() {
			for (const [id, [kind, state]] of this.#map)
				yield {id, kind, state}
		}

		reset() {
			this.#map.clear()
		}

		import(data: GameData) {
			for (const [id, ...entry] of data)
				this.#map.set(id, entry)
		}

		export(): GameData {
			return [...this.#map]
				.map(([id, [kind, state]]) => [id, kind, state])
		}
	}

	export type EntityPlugin = {}

	export type EntitySpec<State> = {
		plugins: EntityPlugin[]
		simulate(state: State): void
		replicate(): void
	}

	export type Entity<State> = {
		simulator(state: State): void
		replicator(state: Readonly<State>): void
	}

	export function entity<State>(
			{plugins, simulate, replicate}: EntitySpec<State>
		): Entity<State> {

		return {
			simulator(state) {},
			replicator(state) {},
		}
	}

	// class BaseEntity<xBase, xState> {
	// 	base: xBase
	// 	state: xState
	// 	constructor() {}
	// }

	// export const prepare_entity = (
	// 	<xBase>(base: xBase) => (
	// 		<xKind extends string>(kind: xKind) => (
	// 			<xState extends Pojo<any>>() => class {
	// 				static kind = kind
	// 				base = base
	// 				constructor(public state: xState) {}
	// 			}
	// 		)
	// 	)
	// )

	// export function entity<xKind extends string>(kind: xKind) {
	// 	return function<xState extends Pojo<any>>() {
	// 		return class {
	// 			static kind = kind
	// 			protected base = base
	// 			constructor(public state: xState) {}
	// 		}
	// 	}
	// }

	export class Replicator {

	}
}

