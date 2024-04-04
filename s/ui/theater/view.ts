
import {html} from "@benev/slate"
import {Menus} from "./menus.js"
import {nexus} from "../nexus.js"
import {styles} from "./styles.js"
import {Stage} from "../../stage/stage.js"
import {Framerate} from "./views/framerate/view.js"
import {pointerType} from "./utils/pointer_type.js"

export const Theater = nexus.shadow_view(use => ({
		stage, menus, menuButton, arrows,
		onMenuClick = () => {},
		onMenuTouch = () => {},
		onBackdropClick = () => {},
		onBackdropTouch = () => {},
	}: {
		stage: Stage
		menus: Menus
		menuButton: any
		arrows: boolean
		onMenuClick?: (event: PointerEvent) => void
		onMenuTouch?: (event: PointerEvent) => void
		onBackdropClick?: (event: PointerEvent) => void
		onBackdropTouch?: (event: PointerEvent) => void
	}) => {

	use.styles(styles)

	const onBackdrop = pointerType({
		onMouse: onBackdropClick,
		onTouch: onBackdropTouch,
	})

	const onMenu = pointerType({
		onMouse: onMenuClick,
		onTouch: onMenuTouch,
	})

	return html`
		${stage.porthole.canvas}

		<slot></slot>

		<div class=overlay ?data-open="${menus.open.value}">
			<div class=backdrop @pointerdown="${onBackdrop}"></div>
			<div class=baseplate>
				<slot name=baseplate></slot>

				<div class=plate>
					<nav>
						<button class=menubutton @pointerdown="${onMenu}">
							${menuButton}
						</button>

						${arrows ? html`
							<button
								class=arrow
								title="press q"
								@click="${() => menus.previous()}">
								❮
							</button>
						` : html`<div class=spacer></div>`}

						${menus.names.map(({name, active, activate}) => html`
							<button
								class=menu-item
								?data-active="${active}"
								@click="${activate}">
								${name}
							</button>
						`)}

						${arrows ? html`
							<button
								class=arrow
								title="press e"
								@click="${() => menus.next()}">
								❯
							</button>
						` : null}
					</nav>

					<div class=panel>
						${menus.panel({stage})}
					</div>
				</div>

				${Framerate([stage])}
			</div>
		</div>
	`
})

