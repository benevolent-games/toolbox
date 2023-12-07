
import {html, reactor} from "@benev/slate"
import {styles} from "./styles.js"
import {slate} from "../../slate.js"

export const AnimPanel = slate.shadow_view({styles}, use => () => {
	const {world} = use.context

	const zoom = use.signal(4)
	const swivel = use.signal(160)

	use.prepare(() => {
		reactor.reaction(() => world.jib.zoom(zoom.value))
		reactor.reaction(() => world.jib.swivel(swivel.value))
	})

	const onNumberInput = (
		(fn: (n: number) => void) =>
			(event: InputEvent) =>
				fn(Number((event.currentTarget as HTMLInputElement).value))
	)

	return html`
		<label>
			<span>camera swivel</span>
			<input
				type=range value="${swivel}" min=0 max=360 step=0.01
				@input="${onNumberInput(degrees => swivel.value = degrees)}"
				/>
		</label>

		<label>
			<span>camera distance</span>
			<input
				type=range value="${zoom}" min=1 max=10 step=0.01
				@input="${onNumberInput(x => zoom.value = x)}"
				/>
		</label>
	`
})

