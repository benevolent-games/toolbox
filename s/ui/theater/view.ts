
import {html} from "@benev/slate"
import {Menus} from "./menus.js"
import {nexus} from "../nexus.js"
import {styles} from "./styles.js"
import {Stage} from "../../stage/stage.js"
import {Framerate} from "./views/framerate/view.js"

export const Theater = nexus.shadow_view(use => ({
		stage, menus, leadButton,
		onLeadToggled = () => {},
	}: {
		stage: Stage
		menus: Menus
		leadButton: any
		onLeadToggled?: (open: boolean) => void
	}) => {

	use.styles(styles)

	function clickLead() {
		menus.toggle()
		onLeadToggled(menus.open.value)
	}

	return html`
		${stage.porthole.canvas}

		<slot></slot>

		<div class=overlay ?data-open="${menus.open.value}">
			<div class=plate>
				<nav>
					<button
						class=lead
						@click="${clickLead}">
						${leadButton}
					</button>

					<button
						class=arrow
						title="press q"
						@click="${() => menus.previous()}">
						❮
					</button>

					${menus.names.map(({name, active, activate}) => html`
						<button
							class=menu-item
							?data-active="${active}"
							@click="${activate}">
							${name}
						</button>
					`)}

					<button
						class=arrow
						title="press e"
						@click="${() => menus.next()}">
						❯
					</button>
				</nav>

				<div class=panel>${menus.panel({stage})}</div>
			</div>

			${Framerate([stage])}
		</div>
	`
})

