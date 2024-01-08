
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
	bottom: 0;
	right: 0;
	background: #000a;
	width: 28em;
	max-width: 40%;
	max-height: 90%;
}

`

