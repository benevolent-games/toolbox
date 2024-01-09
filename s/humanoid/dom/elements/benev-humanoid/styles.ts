
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

[view="panel"] {
	position: absolute;
	inset: 0;
}

.framerate {
	position: absolute;
	top: 0.1em;
	right: 0.5em;
	color: white;
	text-shadow: 1px 2px 2px #0008;
	font-family: monospace;
}

`

