
import {Context, Nexus, css} from "@benev/slate"

export const cssReset = css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
`

export const plainNexus = new Nexus(new class extends Context {
	theme = cssReset
})

