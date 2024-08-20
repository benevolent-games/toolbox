
import {html, css, interval} from "@benev/slate"

import {nexus} from "../../../nexus.js"
import {AnyEngine} from "../../../../iron/parts/types.js"

export const Framerate = nexus.shadowView(use => (engine: AnyEngine) => {
	use.name("framerate")
	use.styles(css`
		:host {
			display: flex;
			gap: 0em;
			color: white;
			text-shadow: 1px 2px 2px #0008;
			font-family: monospace;
		}
		:host > * { text-align: center; }
		.framerate { min-width: 2em; color: white; }
		.spacer { opacity: 0.5; }
		.tickrate { min-width: 2em; color: yellow; }
	`)

	const framerate = use.signal(0)
	// const tickrate = use.signal(0)

	use.mount(() => interval.hz(10, () => {
		framerate.value = engine.getFps() ?? 0
		// tickrate.value = stage?.measured_tick_rate ?? 0
	}))

	return html`
		<span class=framerate>${Math.round(framerate.value)}</span>
	`
})

/*

<span class=spacer>::</span>
<span class=tickrate>${Math.round(tickrate.value)}</span>

*/

