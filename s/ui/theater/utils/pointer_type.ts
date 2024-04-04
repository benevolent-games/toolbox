
export function pointerType(o: {
		onMouse: (event: PointerEvent) => void
		onTouch: (event: PointerEvent) => void
	}) {

	return (event: PointerEvent) => (
		event.pointerType === "touch"
			? o.onTouch(event)
			: o.onMouse(event)
	)
}

