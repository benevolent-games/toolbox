

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

.theater__wrapper {
	width: fit-content;
	position: relative;
}

.panel {
	position: absolute;
	top: 0;
	right: 0;
}
`
