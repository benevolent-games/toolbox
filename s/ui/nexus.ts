
import {Stage} from "../stage/stage"
import {Context, css, Nexus} from "@benev/slate"

export const theme = css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;

		scrollbar-width: thin;
		scrollbar-color: #333 transparent;
	}

	::-webkit-scrollbar { width: 8px; }
	::-webkit-scrollbar-track { background: transparent; }
	::-webkit-scrollbar-thumb { background: #333; border-radius: 1em; }
	::-webkit-scrollbar-thumb:hover { background: #444; }

	a {
		color: var(--link);
		text-decoration: none;

		&:visited {
			color: color-mix(in srgb, purple, var(--link) 70%);
		}

		&:hover {
			color: color-mix(in srgb, white, var(--link) 90%);
			text-decoration: underline;
		}

		&:active {
			color: color-mix(in srgb, white, var(--link) 50%);
		}
	}
`

export class BenevContext extends Context {
	theme = theme
}

export abstract class BenevGameContext extends BenevContext {
	abstract stage: Stage
}

export const nexus = new Nexus<BenevContext>(new BenevContext())
export const gameNexus = new Nexus<BenevGameContext>()

