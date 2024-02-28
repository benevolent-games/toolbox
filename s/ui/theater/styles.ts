
import {css} from "@benev/slate"

export const styles = css`

:host {
	display: block;
	--bg1: #333c;
	--bg2: #000c;
	--text: #fff;
	--primary: #f90;
	--speed: 200ms;
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
				transition: all var(--speed);
			}

			> button {
				font: inherit;
				border: none;
				border-top: 2px solid transparent;
				&:focus { outline: 0; }
			}

			.lead {
				opacity: 1;
				background: var(--primary);
				text-shadow: 1px 1px 2px #000;
			}

			:is(.menu-item, .arrow) {
				opacity: 0.5;
				color: color-mix(in srgb, transparent, var(--text) 50%);
				&:hover {
					opacity: 0.75;
					color: var(--text);
					background: var(--bg1);
				}
				&[data-active] {
					opacity: 1;
					color: var(--text);
					background: var(--bg1);
					border-color: var(--primary);
				}
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
			transition: opacity var(--speed);
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

