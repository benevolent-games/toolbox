
import {css} from "@benev/slate"

export const styles = css`

:host {
	display: block;
	--bg1: #333c;
	--bg2: #222c;
	--text: #fff;
	--primary: #f90;
	text-shadow: 1px 1px 2px #0008;
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

			> * {
				pointer-events: all;
				color: var(--text);
				background: var(--bg2);
				padding: 0.2em 0.6em;
				transition: all linear 200ms;
			}

			> button {
				font: inherit;
				border: none;
				&:focus { outline: 0; }
			}

			.lead {
				opacity: 1;
				background: var(--primary);
			}

			.arrow {
				opacity: 0.3;
				color: var(--text);
				background: color-mix(in srgb, transparent, var(--bg2) 10%);
				&:hover { opacity: 0.6; }
			}

			.menu-item {
				opacity: 0.1;
				&:hover { opacity: 0.3; }
				&[data-active] { opacity: 1; background: var(--bg1); }
			}
		}

		> .panel {
			pointer-events: all;
			flex: 1 1 auto;
			padding: 0.5em;
			overflow-y: auto;
			height: 0px;
			background: var(--bg1);
			backdrop-filter: blur(1em);

			opacity: 1;
			transition: 200ms linear opacity;
		}
	}

	> [view="framerate"] {
		font-size: 0.8em;
		position: absolute;
		top: 0;
		right: 0;
		padding: 0.5rem;
	}

	&:not([data-open]) {
		:is(.panel, .arrow, .menu-item) {
			opacity: 0 !important;
		}
		.lead {
			opacity: 0.3 !important;
			background: #0000 !important;
		}
	}
}

`

