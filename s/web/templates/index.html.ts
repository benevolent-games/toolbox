
import {html} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

import pageHtml from "../partials/page.html.js"

export default (context: WebsiteContext) => pageHtml({
	...context,
	mainContent: html`

		<h1><span>🧰</span> toolbox</h1>
		<h4>centralized collection of essential tools</h4>
			<benev-theater></benev-theater>
				<range-slider
				label="Range slider"
			></range-slider>

	`
})
