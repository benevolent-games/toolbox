
import {FullRezzers} from "./parts/types.js"
import {systematize} from "../../systematize.js"

export const reifySystem = (
	(rezzers: FullRezzers) => systematize("reify", ({entities}) => () => {

		for (const rezzer of rezzers) {
			for (const [id, entity] of entities.select(...rezzer.external.kinds)) {

				// updating existing objects
				if (rezzer.external.has(id))
					rezzer.internal.update(rezzer.map.get(id)!, entity)

				// adding new objects
				else
					rezzer.internal.add(id, entity)
			}

			// delete obsolete objects
			for (const id of rezzer.external.ids)
				if (!entities.has(id))
					rezzer.internal.delete(id)
		}
	})
)

