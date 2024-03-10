
/**
 * simple pub-sub mechanism.
 *
 *     const onWhatever = pubb((a: number, b: boolean) => console.log(a, b))
 *     onWhatever.publish(123, true)
 *
 */
export function pubsub<P extends any[]>() {
	const set = new Set<(...p: P) => void>()

	function subscribe(fn: (...p: P) => void) {
		set.add(fn)
		return () => set.delete(fn)
	}

	subscribe.publish = (...p: P) => {
		for (const fn of set)
			fn(...p)
	}

	return subscribe
}

