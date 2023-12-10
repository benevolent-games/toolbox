
import {css} from "@benev/slate"
export const styles = css`

:host {
	display: block;
}

ul {
	list-style: none;
	padding: 0;

	display: flex;
	flex-wrap: wrap;
	gap: 0.2em;

	margin-top: 1em;
	font-size: 0.7em;

	> li {
		flex: 0 0 auto;
		width: max-content;

		display: flex;

		background: rgba(132, 132, 132, 0.1);
		color: #fff8;
		border: 1px solid #fff2;

		cursor: default;
		border-radius: 0.2em;
		overflow: hidden;

		&[data-active] {
			background: #38ff0026;
		}

		> span {
			display: block;
			padding: 0 0.3em;
		}

		> span:nth-child(2) {
			background: #fff1;
		}
	}
}

ul.missing-anims {
	li {
		background: #f003;
	}
}

`

