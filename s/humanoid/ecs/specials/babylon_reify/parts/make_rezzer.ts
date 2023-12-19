
import {Core} from "../../../../../core/core.js"
import {HumanoidSchema} from "../../../schema.js"
import {FullRezzer, InternalRezzer} from "./types.js"

export const makeRezzer = (
	<K extends keyof HumanoidSchema>(...kinds: K[]) => (
		<T>(make: (map: Map<Core.Id, T>) => InternalRezzer<K>): FullRezzer<T, K> => {
			const map = new Map<Core.Id, T>()
			return {
				internal: make(map),
				external: {
					get kinds() { return kinds },
					has: id => map.has(id),
					get: id => map.get(id),
					get ids() { return [...map.keys()] },
				},
			}
		}
	)
)

