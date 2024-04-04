
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
	&:focus { outline: 0; }
}

.overlay {
	pointer-events: none;
	z-index: 0;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;

	.backdrop {
		z-index: 1;
		position: absolute;
		inset: 0;
	}

	.baseplate {
		position: absolute;
		inset: 0;
		margin: auto;
		margin-top: 0;
		aspect-ratio: 16 / 9;
		max-height: 100%;
		max-width: 100%;
		width: auto;
		height: 100%;
	}

	.plate {
		z-index: 3;
		position: relative;
		width: 80%;
		height: 100%;
		padding: 0.5rem;
		max-width: 40rem;

		display: flex;
		flex-direction: column;

		> nav {
			display: flex;

			> * {
				color: var(--text);
				background: var(--bg2);
				padding: 0.2em 0.6em;
				transition: all var(--speed) linear;
			}

			> button {
				font: inherit;
				border: none;
				border-top: 2px solid transparent;
				&:focus { outline: 0; }
			}

			.menubutton {
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
			z-index: 2;
			flex: 1 1 auto;
			padding: 0.5em;
			overflow-y: auto;
			height: 0px;
			background: var(--bg1);
			backdrop-filter: blur(1em);

			opacity: 1;
			transition: opacity var(--speed) linear;
		}
	}

	[view="framerate"] {
		font-size: 0.8em;
		position: absolute;
		top: 0;
		right: 0;
		padding: 0.5rem;
	}

	&[data-open] {
		.panel { pointer-events: all; }
		.backdrop { pointer-events: all; }
		.plate > nav > * { pointer-events: all; }
	}

	&:not([data-open]) {
		:is(.panel, .arrow, .menu-item) {
			opacity: 0 !important;
		}
		.menubutton {
			pointer-events: all;
			opacity: 0.3 !important;
			background: #0000 !important;
		}
	}
}

`

