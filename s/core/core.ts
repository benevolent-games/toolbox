
import {generate_id} from "@benev/slate"

export namespace Core {
	export const freshId = () => generate_id(32)

	export type Id = string
	export type Aspect = any
	export type Kind = string

	export type AspectSchema = {[kind: Kind]: Aspect}
	export type AsAspectSchema<AS extends AspectSchema> = AS

	export type AspectReport<Kind extends keyof any, Aspect> = [
		Aspect,
		Kind,
	]

	export function configure_systems<Params, Tick>() {
		return function system(_name: string, fn: (once: Params) => (tick: Tick) => void) {
			return fn
		}
	}

	export class Machine<AS extends AspectSchema> {
		#nodes = new Map<Id, Set<Id>>()
		#aspects = new Map<Id, [Kind, Aspect]>()

		node(id: Id): Partial<AS> {
			const set = this.#nodes.get(id)
			if (!set)
				throw new Error(`node not found "${id}"`)
			return this.#assemble_aspects(...set)
		}

		#assemble_aspects(...ids: Id[]) {
			const aspects: Partial<AS> = {}

			for (const id of ids) {
				const [aspect, kind] = this.aspect(id)
				aspects[kind] = aspect
			}

			return aspects
		}

		aspect<Kind extends keyof AS = keyof AS>(id: Id): AspectReport<Kind, AS[Kind]> {
			const result = this.#aspects.get(id)
			if (!result)
				throw new Error(`aspect not found "${id}"`)
			const [kind, aspect] = result as [Kind, AS[Kind]]
			return [aspect, kind]
		}

		create_node(...aspectIds: Id[]) {
			for (const aspectId of aspectIds)
				this.aspect(aspectId)
			const id = freshId()
			const set = new Set<Id>(aspectIds)
			this.#nodes.set(id, set)
			return id
		}

		create_aspect<Kind extends keyof AS>(kind: Kind, aspect: AS[Kind]) {
			const id = freshId()
			this.#aspects.set(id, [kind as any, aspect])
			return id
		}

		attach(nodeId: Id, aspectId: Id) {
			this.#nodes.get(nodeId)!.add(aspectId)
		}

		detach(nodeId: Id, aspectId: Id) {
			this.#nodes.get(nodeId)!.delete(aspectId)
		}

		*select<Kind extends keyof AS>(...kinds: Kind[]) {
			for (const [nodeId, aspectIds] of this.#nodes) {
				const aspects = this.#assemble_aspects(...aspectIds)
				const node_matches_selector = kinds.every(kind => kind in aspects)

				if (node_matches_selector)
					yield [
						aspects,
						nodeId,
					] as [{[K in Kind]: AS[K]} & Partial<AS>, Id]
			}
		}

		delete_node(id: Id) {
			this.#nodes.delete(id)
		}

		delete_orphaned_aspects() {
			const connected = new Set<Id>()

			for (const [,set] of this.#nodes)
				for (const aspectId of set)
					connected.add(aspectId)

			const aspect_ids_to_delete = [...this.#aspects]
				.map(([aspectId]) => aspectId)
				.filter(aspectId => !connected.has(aspectId))

			for (const aspectId of aspect_ids_to_delete)
				this.#aspects.delete(aspectId)
		}
	}
}

