
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

	.panel {
		z-index: 2;
		position: relative;
		width: 20em;
		max-width: calc(100% - 2em);
		padding: 1em;
		margin: 1em;

		background: #0004;
		color: #fffa;

		backdrop-filter: blur(1em);
		border-radius: 0.3em;

		> * + * {
			margin-top: 1em;
		}
	}
}

canvas {
	display: block;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	outline: 0;
}

`

