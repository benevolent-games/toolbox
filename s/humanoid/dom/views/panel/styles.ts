
import {css} from "@benev/slate"
export const styles = css`

:host {
	display: block;
	position: relative;
	pointer-events: none;
}

:host > * {
	pointer-events: all;
}

nav {
	position: absolute;
	top: 0.1em;
	left: 0.8em;
	height: 1.2em;

	> button {
		padding: 0.5em;
		background: #222d;
		color: inherit;
		border: none;
		border-radius: 0.5em;

		&[data-opened] {
			border-radius: 0.5em 0.5em 0 0;
		}

		opacity: 0.2;
		&:hover { opacity: 0.6; }
		&[data-opened] { opacity: 1; }
	}
}

.panel {
	position: absolute;
	top: 1.8em;
	left: 0.1em;
	width: 80%;
	max-width: 28em;
	bottom: 0.5em;
	padding: 1em;

	user-select: none;
	border-radius: 1em;
	background: #222d;
	backdrop-filter: blur(1em);
	box-shadow: 0.3em 0.6em 0.5em #0004;
	border-top: 1px solid #fff2;

	.content {
		height: 100%;
		overflow-y: auto;
		padding-right: 0.5em;
	}
}

.content > article {
	border-left: 2px solid;
}

header {
	font-weight: bold;
	background: #1118;
	padding: 0.2em 0.5em;
	&[data-active] {
		background: #0ac;
		box-shadow: 0.1em 0.2em 0.2em #0004;
		text-shadow: 0.1em 0.1em 0.1em #0008;
		color: white;
	}
}

* + header {
	margin-top: 1em;
}

article {
	background: #1114;
	& + article {
		margin-top: 1em;
	}
	& > article {
		padding: 1em;
	}
}

[data-hidden] {
	opacity: 0.25;
}

section {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5em;
	padding-left: 0.5em;

	> * {
		font-size: 0.8em;
		flex: 0 0 auto;
		width: 8rem;
		padding: 0.1rem;
		max-width: 100%;
	}
}

`
