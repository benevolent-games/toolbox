
import {Context, Slate, css} from "@benev/slate"

export const slate = new Slate(new class extends Context {
	theme = css`
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
	`
})

