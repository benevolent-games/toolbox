
import {nexus} from "../../../../nexus.js"
import {TemplateResult, html} from "@benev/slate"

export const Toggler = nexus.light_view(use => (content: () => TemplateResult) => {
	const opened = use.signal(false)
	const toggle = () => opened.value = !opened.value

	return html`
		<nav>
			<button
				?data-opened="${opened}"
				@click="${toggle}">
				settings
			</button>
		</nav>
		${opened.value
			? content()
			: null}
	`
})

