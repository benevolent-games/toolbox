
import {slate} from "../slate.js"
import {css, html, prep_render_op} from "@benev/slate"

export const render_op = prep_render_op({
	error: reason => ErrorIndicator([reason]),
	loading: () => LoadingIndicator([]),
})

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

export const ErrorIndicator = slate.shadow_view({styles: css`
	:host {
		color: red;
		font-family: monospace;
	}
`}, _use => (reason: string) => html`${reason}`)

export const LoadingIndicator = slate.shadow_view({styles: css`
		:host {
			color: #8888;
			font-family: monospace;
		}
	`}, use => () => {

	const frame = use.signal(6)

	use.setup(() => {
		const id = setInterval(() => {
			const next = frame.value + 1
			frame.value = (next < loading_frames.length)
				? next
				: 0
		}, 1000 / 20)
		return () => clearInterval(id)
	})

	return html`${loading_frames[frame.value]}`
})

