
import {css} from "@benev/slate"
export const styles = css`

:host {
	display: block;
	width: 8em;
	height: 8em;
	--size: var(--nub-stick-size, 66%);
	--background: var(--nub-stick-background, black);
	--color: var(--nub-stick-color, white);
}

[part="base"] {
	position: relative;
	aspect-ratio: 1/1;
	width: 100%;
	height: 100%;
	background: var(--background);
	border-radius: 100%;
}

[part="over"], [part="under"] {
	position: absolute;
	inset: 0;
	width: var(--size);
	height: var(--size);
	border-radius: 100%;
	margin: auto;
	pointer-events: none;
	background: var(--color);
}

[part="under"] {
	opacity: 0.5;
}

`
