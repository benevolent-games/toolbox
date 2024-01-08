
import {css} from "@benev/slate"
export const styles = css`

:host {
	position: relative;
	display: block;
	width: 100%;
	height: 100%;

	--alpha: yellow;
}

canvas {
	display: block;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	outline: 0;
}

.panel {
	position: absolute;
	top: 1em;
	left: 1em;
	width: 28em;
	width: 40%;
	height: 90%;
	padding: 1em;

	border-radius: 1em;
	background: #222e;
	backdrop-filter: blur(1em);
	box-shadow: 0.3em 0.6em 0.5em #0004;

	> div {
		height: 100%;
		overflow-y: auto;
	}
}


`

