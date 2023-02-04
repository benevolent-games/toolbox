
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

:host([view-mode="small"]) {
	width: 100%;
	max-width: 40em;
	aspect-ratio: 16 / 9;
}

button {
	display: flex;
	background: none;
	border: none;
	font-size: inherit;
	color: inherit;
}

canvas {
	width: 100%;
	height: 100%;
	background: #0004;
}

.button_bar {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 0.5em;

	position: absolute;
	top: 0;
	right: 0;
	left: 0;

	color: white;
}

.profile-info {
	position: relative;
}

.profile-info[data-opened] {
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(3px);
}

.mode-panel, .profile-panel { 
	display: none; 
	flex-direction: column;
}

.view-mode {
	margin-left: 0.5em;
}

.toggle {
	display: flex;
	width: 32px;
	padding: 0.2em 0;
	background-color: #0000003d;
	justify-content: center;
	align-items: center;
	border-bottom-right-radius: 5px;
	border-bottom-left-radius: 5px;
	cursor: pointer;
}

.toggle[data-opened] {
	border-radius: 0px;
}

.mode-panel {
	display: none;
}

.mode-panel[data-opened] {
	display: flex;
	flex-direction: column;
	padding: 0.5em;
	border-radius: 10px;
	border-top-left-radius: 0px;
	background-color: #0000003d;
	position: absolute;
}

.mode-panel span {
	display: flex;
	align-items: center;
	padding: 0 0.1em;
}

.mode-panel span[data-selected] {
	filter: opacity(0.5);
}

.mode-panel span:not([data-selected]):hover {
	background-color: rgba(0, 0, 0, 0.2);
	cursor: pointer;
	border-radius: 5px;
}

.mode-panel svg {
	pointer-events: none;
}

.separator {
	margin: 0 0.5rem;
}

.profile-panel[data-opened] {
	display: flex;
	flex-direction: column;

	position: absolute;
	width: max-content;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(3px);
	padding: 0.5em;
	border-radius: 0 8px 8px;
	opacity: .7;
}

`
