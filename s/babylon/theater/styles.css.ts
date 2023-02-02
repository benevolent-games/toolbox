

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
	--canvas-width: 100vw;
	--canvas-height: 100vh;
	overflow: hidden;
}

:host([view-mode="fullscreen"]) {
	--canvas-width: 100vw;
	--canvas-height: 100vh;
}

:host([view-mode="embed"]) {
	--canvas-width: 50vw;
	--canvas-height: 70vh;
}

::slotted(canvas) {
	width: var(--canvas-width, 60vw);
	height: var(--canvas-height, 60vh)
}

:host {
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

.mode-panel {
	display: none;
}

.mode-panel[data-opened=true] {
	display: flex;
	flex-direction: column;
}

`
