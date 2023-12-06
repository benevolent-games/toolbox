
export function setupListener(
		target: EventTarget,
		eventName: string,
		listener: (e: any) => void,
	) {

	return () => {
		target.addEventListener(eventName, listener)
		return () => window.removeEventListener(
			eventName,
			listener,
		)
	}
}
