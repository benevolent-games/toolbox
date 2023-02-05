import {UseView, view} from "@chasemoskal/magical"
import {html, SVGTemplateResult, TemplateResult} from "lit"
import {setupListener} from "../utils/setup-listener.js"

export type ButtonPanelParts = {
	button: () => TemplateResult | SVGTemplateResult
	panel: () => TemplateResult
	name: string
}

export type ButtonPanelFunc<P extends any[]> = (
	(use: UseView) => (...params: P) => ButtonPanelParts
)

export function buttonPanelView<P extends any[]>(f: ButtonPanelFunc<P>) {
	return view({}, use => (...p: P) => {

		const {button, panel, name} = f(use)(...p)
		const [isOpen, setOpen] = use.state(false)
		const toggle = () => setOpen(!isOpen)

		use.setup(setupListener(window, "pointerdown", (e) => {
		const modePanel = e.composedPath().find((element: HTMLElement) =>
			element.className == name)
		if(!modePanel) {setOpen(false)}
		}))

		return html`
			<div class=${name}>
				<button 
					class=toggle
					?data-opened=${isOpen}
					@click=${toggle}>
					${button()}
				</button>
				${isOpen
					? panel()
					: null}
			</div>
		`
	})
}