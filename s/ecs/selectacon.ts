
export function setupSelectacon<C extends {}>(
		entities: Map<number, Partial<C>>
	) {

	const indexOfComponentNamesToEntityIds = new Map<keyof C, Set<number>>()

	function getEntitySet(componentName: keyof C) {
		let set = indexOfComponentNamesToEntityIds.get(componentName)
		if (!set) {
			set = new Set()
			indexOfComponentNamesToEntityIds.set(componentName, set)
		}
		return set
	}

	function entityWasDeleted(id: number) {
		for (const set of indexOfComponentNamesToEntityIds.values())
			set.delete(id)
	}

	function entityWasAddedOrUpdated(id: number, components: Partial<C>) {
		entityWasDeleted(id)
		for (const key of Object.keys(components))
			getEntitySet(<keyof C>key).add(id)
	}

	function select<A extends keyof C>(
			selectors: A[],
			filter?: (components: {[P in A]: C[P]} & Partial<C>) => boolean,
			not?: number,
		) {

		const runFilter = filter ?? (c => c)
		const results: [number, {[P in A]: C[P]} & Partial<C>][] = []
		const ids: number[] = []

		for (const selector of selectors)
			for (const id of getEntitySet(selector))
				if (id !== not)
					ids.push(id)

		for (const id of ids) {
			const components = entities.get(id)!
			const keys = Object.keys(components)
			const match = (
				selectors
					.every(selector => keys.includes(<string>selector))
			)
			if (match && runFilter(<any>components))
				results.push([id, <any>components])
		}

		return results
	}

	return {
		select,
		entityWasDeleted,
		entityWasAddedOrUpdated,
	}
}
