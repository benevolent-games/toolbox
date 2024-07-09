
import {css} from "@benev/slate"

export const styles = css`

.orchestrator {
	position: relative;
	display: block;
	width: 100%;
	height: 100%;

	> * {
		display: block;
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
}

.orchestrator-loading {
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

