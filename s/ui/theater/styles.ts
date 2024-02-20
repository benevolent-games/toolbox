
import {css} from "@benev/slate"

export const styles = css`

:host {
	display: block;
}

canvas {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.overlay {
	pointer-events: none;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;

	> .plate {
		width: 100%;
		height: 100%;
		padding: 0.5rem;
		max-width: 40rem;

		display: flex;
		flex-direction: column;

		> nav {
			display: flex;
			> button {
				font: inherit;
				pointer-events: all;
				background: #333333cc;
				color: #fffc;
				border: none;
				padding: 0.2em 0.6em;

				opacity: 0.3;
				&[data-active] {
					opacity: 1;
				}
			}
		}

		> .panel {
			pointer-events: all;
			flex: 1 1 auto;
			padding: 0.5em;
			overflow-y: auto;
			height: 0px;
			background: #333333cc;
			backdrop-filter: blur(1em);
		}
	}

	> [view="framerate"] {
		font-size: 0.8em;
		position: absolute;
		top: 0;
		right: 0;
		padding: 0.5rem;
	}

	> .plate {
		opacity: 1;
		transition: 300ms linear opacity;
	}

	&[data-locked] > .plate {
		opacity: 0;
	}
}

`

