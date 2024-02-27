
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
				background: #3334;
				color: #fffc;
				border: none;
				padding: 0.2em 0.6em;
				text-shadow: 1px 1px 2px #0008;
				transition: all linear 200ms;
				&:focus { outline: 0; }
			}

			.lead {
				opacity: 1;
				background: #f90c;
			}

			.menu-item {
				&:hover { background: #3338; color: #fff8; }
				&[data-active] { background: #333c; color: #fffc; }
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
		:is(.panel, .menu-item) {
			opacity: 0;
		}
		.lead {
			opacity: 0.3 !important;
			background: #0000 !important;
		}
	}
}

`

