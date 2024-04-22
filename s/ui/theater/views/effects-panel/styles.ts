
import {css} from "@benev/slate"

export const styles = css`

hr {
	display: block;
	margin: 1em;
	border: none;
	height: 2px;
	background: #fff4;
}

article {
	background: #0004;
	transition: background 300ms linear;

	+ article {
		margin-top: 1em;
	}

	> header {
		padding: 0.4em 1em;
		display: flex;
		gap: 0.5em;
		background: #bbb4;
		color: white;
		font-size: 1.1em;
		font-weight: bold;
		text-shadow: 1px 2px 2px #0006;
		transition: background 300ms linear;
	}

	> textarea {
		border: none;
		font: inherit;
		font-size: 0.7em;
		font-family: monospace;
		width: 100%;
		height: 5em;
		padding: 1em;
		overflow: hidden;
		background: #0002;
		color: #0f08;
	}

	> section {
		padding: 1em;
		+ * {
			margin-top: 0.6em;
		}
		> * + * {
			display: block;
			margin-top: 0.5em;
		}
	}

	&[data-dynamic] {
		> header {
			background: #0008;
		}
		> section {
			opacity: 0.3;
		}
		&[data-active] {
			background: #004da147;
			> header {
				background: #0af5;
			}
			> section {
				opacity: 1;
			}
		}
	}
}

`

