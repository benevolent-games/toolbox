
import {css} from "@benev/slate"
export const styles = css`

:host > * + * {
	margin-top: 1em;
}

.sticks {
	display: flex;
	flex-direction: row;
	justify-content: space-around;

	& [view="nub-stick"] {
		flex: 0 0 25%;
		--nub-stick-background: #fff1;
		--nub-stick-color: #888a;
	}
}

.bars {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	font-size: 0.6em;
	gap: 1em;


	.barGroup {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;

		.name {}

		.ascii {
			flex: 0 0 auto;
			display: flex;
			flex-direction: column;
			font-family: monospace;

			.bar {
				cursor: default;
				opacity: 0.8;

				&:hover {
					opacity: 1;
				}
			}
		}
	}
}

`

