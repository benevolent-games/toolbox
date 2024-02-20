
import {css} from "@benev/slate"

export const styles = css`

article {
	background: #0004;
	transition: 300ms linear background;

	+ article {
		margin-top: 1em;
	}

	> header {
		padding: 0.4em 1em;
		display: flex;
		gap: 0.5em;
		background: #494848;
		color: white;
		font-size: 1.1em;
		font-weight: bold;
		text-shadow: 1px 2px 2px #0006;
		transition: 300ms linear background;
	}

	> textarea {
		border: none;
		font: inherit;
		font-size: 0.7em;
		font-family: monospace;
		width: 100%;
		height: 5em;
		padding: 0.3em;
		overflow: hidden;
		background: #0002;
		color: #0f08;
	}

	> section {
		padding: 1em;
		+ * {
			margin-top: 0.6em;
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
				background: #266e99;
			}
			> section {
				opacity: 1;
			}
		}
	}
}

`

