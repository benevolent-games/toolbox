
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
	background: #222d;
	backdrop-filter: blur(1em);
	box-shadow: 0.3em 0.6em 0.5em #0004;

	[view="panel"] {
		height: 100%;
		overflow-y: auto;
	}

	button.close {
		position: absolute;
		top: -0.5em;
		right: -0.5em;

		background: #111;
		color: inherit;
	}
}

button.settings {
	position: absolute;
	top: 0.2em;
	left: 0.2em;

	font-size: 1em;
	padding: 0.1em;
	border: none;
	border-radius: 2em;

	background: transparent;
	color: inherit;
}

button {
	width: 2em;
	height: 2em;
	line-height: 1em;
	border-radius: 2em;
	border: none;

	opacity: 0.8;
	&:hover { opacity: 1; }
}

`

