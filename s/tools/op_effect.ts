
import {plainNexus} from "./plain_nexus.js"
import {css, html, interval, prep_render_op} from "@benev/slate"

const styles = {
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

const ErrorIndicator = plainNexus.shadow_view(use => (reason: string) => {
	use.name("error-indicator")
	use.styles(styles.error)

	return html`${reason || "unknown error"}`
})

const LoadingIndicator = plainNexus.shadow_view(use => (hz: number, animation: string[]) => {
	use.name("loading-indicator")
	use.styles(styles.loading)

	const frame = use.signal(6)

	use.mount(() => interval(hz, () => {
		const next = frame.value + 1
		frame.value = (next < animation.length)
			? next
			: 0
	}))

	return html`${animation[frame.value]}`
})

export const prepare_op_effect = (hz: number, animation: string[]) => prep_render_op({
	error: reason => ErrorIndicator([reason]),
	loading: () => LoadingIndicator([hz, animation]),
})

export const op_effect = {
	binary: prepare_op_effect(20, [
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
	]),
	braille: prepare_op_effect(20, [
		"⡿",
		"⣟",
		"⣯",
		"⣷",
		"⣾",
		"⣽",
		"⣻",
		"⢿",
	]),
}

