

import {css} from "@chasemoskal/magical"
export const styles = css`
*,
*::after,
*::before {
	margin: 0;
	box-sizing: border-box;
}

:host {
	display: block;
}

:host([view-mode="cinema"]) {
	--canvas-width: 90vw;
}

:host([view-mode="fullscreen"]) {}

:host([view-mode="embed"]) {}

::slotted(canvas) {
	width: var(--canvas-width, 60vw);
}

.theater__wrapper {
	width: fit-content;
	position: relative;
}

.button_bar {
	display: flex;
	flex-direction: row-reverse;
	gap: 0.5em;

	position: absolute;
	top: 0;
	right: 0;
}

.view-mode {
	font-size: 0.8rem;
}

`
