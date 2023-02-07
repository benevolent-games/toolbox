
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
	position: fixed;
	inset: 0;
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
	padding: 0.2em 0.4em;
	cursor: pointer;
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

.blanket {
	position: fixed;
	inset: 0;
	background: transparent;
	z-index: 1;
}

.z-2 {
	z-index: 2;
}

.profile-info {
	position: relative;
}

.profile-info[data-opened] {
	background: rgba(0, 0, 0, 0.24);
	backdrop-filter: blur(2px);
}

nub-editor { 
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
	justify-content: center;
	align-items: center;
	cursor: pointer;
}

.toggle[data-opened] {
	background-color: #0000003d;
}

.mode-panel {
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

.profile-panel,
.settings-panel {
	display: flex;
	flex-direction: column;

	position: absolute;
	width: max-content;
	background: rgba(0, 0, 0, 0.24);
	backdrop-filter: blur(2px);
	padding: 0.5em;
	border-radius: 0 8px 8px;
	align-items: flex-start;
}

.settings {
	position: relative
}

.settings[data-opened] {
	background: rgba(0, 0, 0, 0.24);
	backdrop-filter: blur(2px);
}

.settings-panel > label {
	display: flex;
	flex-direction: row-reverse;
	gap: 0.5em;
}

nub-editor {
	display: block;
	position: absolute;
}

.nubs-button {
	display: flex;
	cursor: pointer;
}

.mobile-controls {
	display: flex;
	position: absolute;
	pointer-events: none;
	bottom: 0px;
	width: 100%;
	justify-content: space-around;
	align-items: flex-end;
}

nub-stick {
	width: 80px;
	height: 80px;
	margin-bottom: 5%;
	pointer-events: all;
}

`
