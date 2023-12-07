
import {css} from "@benev/slate"

export const styles = css`

:host {
	display: block;
	width: 100%;
	height: 100%;

	--alpha: yellow;
}

.studio {
	position: absolute;
	inset: 0;
	&[data-drop]::before {
		content: "";
		display: block;
		position: absolute;
		inset: 0;
		z-index: 1;

		border: 0.5em var(--alpha) dashed;
		background: color-mix(in srgb, transparent, var(--alpha) 10%);
	}
}

canvas {
	display: block;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

`

