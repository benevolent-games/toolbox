
import {css} from "@benev/slate"
export const styles = css`

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

			.bar {}
		}
	}
}

`

