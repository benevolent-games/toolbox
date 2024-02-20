
import {html} from "@benev/slate"
import {nexus} from "../nexus.js"
import {styles} from "./styles.js"
import {MenuItem} from "./menus.js"
import {Stage} from "../../stage/stage.js"
import {settings} from "./views/settings/view.js"
import {Framerate} from "./views/framerate/view.js"

export const Theater = nexus.shadow_view(use => ({
		stage,
		menu: addedMenu
	}: {
		stage: Stage
		menu: MenuItem[]
	}) => {

	const menu = [settings, ...addedMenu]
	use.styles(styles)
	const activated = use.signal<number | null>(null)
	const locked = use.signal(false)
	use.mount(() => stage.pointerLocker.onLockChange(value => locked.value = value))

	const panel_is_open = activated.value !== null

	const isActive = (index: number) => (index === activated.value)
	const closePanel = () => { activated.value = null }
	const setActive = (index: number) => { activated.value = index }
	const getActivePanel = () => menu.at(activated.value ?? 0)?.panel({stage})

	const clickPanelButton = (index: number) => () => {
		if (isActive(index))
			closePanel()
		else
			setActive(index)
	}

	return html`
		${stage.porthole.canvas}

		<div class=overlay ?data-locked="${locked}">
			<div class=plate>
				<nav>
					${menu.map(({name}, index) => html`
						<button
							?data-active="${isActive(index)}"
							@click="${clickPanelButton(index)}">
							${name}
						</button>
					`)}
				</nav>

				${panel_is_open
					? html`<div class=panel>${getActivePanel()}</div>`
					: null}
			</div>

			${Framerate([stage])}
		</div>
	`
})
