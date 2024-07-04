
import {css} from "@benev/slate"

export const styles = css`

:host {
	position: relative;
	display: block;
	width: 100%;
	height: 100%;
}

slot {
	display: block;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

slot[name="loading"] {
	z-index: 1;
	pointer-events: none;

	opacity: 0;
	transition: opacity 250ms linear;

	&[data-active] {
		pointer-events: all;
		opacity: 1;
	}
}

`

