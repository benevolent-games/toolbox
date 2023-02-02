
import {css} from "@chasemoskal/magical"
export const styles = css`

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

:host {
	display: block;
	position: relative;
}

:host([view-mode="cinema"]) {
	width: 100vw;
	height: 100vh;
}

:host([view-mode="fullscreen"]) {
	width: 100vw;
	height: 100vh;
}

:host([view-mode="embed"]) {
	width: 100%;
	max-width: 40em;
	aspect-ratio: 16 / 9;
}

canvas {
	width: 100%;
	height: 100%;
	background: #0004;
}

.button_bar {
	display: flex;
	flex-direction: row;
	gap: 0.5em;

	position: absolute;
	top: 0;
	right: 0;
	left: 0;
}

.mode-panel {
	display: none;
}

.mode-panel[data-opened] {
	display: flex;
	flex-direction: column;
}

`
