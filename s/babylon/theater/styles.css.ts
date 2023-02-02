

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

:host([view-mode="cinema"]) {}

:host([view-mode="fullscreen"]) {}

:host([view-mode="embed"]) {}

.theater__wrapper {
	width: fit-content;
	position: relative;
}

.panel {
	position: absolute;
	top: 0;
	right: 0;
}

.view-mode {
	position: absolute;
	top: 0;
	font-size: 0.8rem;
	right: 7%;
}
`
