import {UseView, view} from "@chasemoskal/magical"
import {html, SVGTemplateResult, TemplateResult} from "lit"

export type ButtonPanelParts = {
	button: () => TemplateResult | SVGTemplateResult
	panel: () => TemplateResult
}

export type ButtonPanelFunc<P extends any[]> = (
	(use: UseView) => (...params: P) => ButtonPanelParts
)

export function buttonPanelView<P extends any[]>(f: ButtonPanelFunc<P>) {
	return view({}, use => (...p: P) => {

		const {button, panel} = f(use)(...p)
		const [isOpen, setOpen] = use.state(false)
		const toggle = () => setOpen(!isOpen)
		
		return html`
			<div>
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