
import {nexus} from "../nexus.js"
import {css, html, interval, prep_render_op} from "@benev/slate"

export const ErrorIndicator = nexus.shadow_view(use => (reason: string) => {
	use.name("error-indicator")
	use.styles(styles.error)

	return html`${reason || "unknown error"}`
})

export const LoadingIndicator = nexus.shadow_view(use => () => {
	use.name("loading-indicator")
	use.styles(styles.loading)

	const frame = use.signal(6)

	use.mount(() => interval(20, () => {
		const next = frame.value + 1
		frame.value = (next < loading_frames.length)
			? next
			: 0
	}))

	return html`${loading_frames[frame.value]}`
})

export const render_op = prep_render_op({
	error: reason => ErrorIndicator([reason]),
	loading: () => LoadingIndicator([]),
})

export const styles = {
	error: css`
		:host {
			color: red;
			font-family: monospace;
		}
	`,
	loading: css`
		:host {
			color: #8888;
			font-family: monospace;
		}
	`,
}

const loading_frames = [
	"00000",
	"10000",
	"01000",
	"10100",
	"11010",
	"01101",
	"10110",
	"11011",
	"11101",
	"01110",
	"00111",
	"10011",
	"11001",
	"01100",
	"10110",
	"01011",
	"00101",
	"00010",
	"00001",
]

