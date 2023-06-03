
import {webpage, html} from "@benev/turtle"
import pageHtml from "./partials/page.html.js"

export default webpage(({v, ...b}) => pageHtml({v, ...b}, {

	head: html`
		<script
			type=importmap-shim
			src="${v("/importmap.json")}"
			defer
		></script>
		<script
			type=module-shim
			src="${v("/html.js")}"
			defer
		></script>
		<script
			type=module-shim
			src="${v("/demo.js")}"
			defer
		></script>
		<script
			src="/node_modules/es-module-shims/dist/es-module-shims.wasm.js"
			defer
		></script>
	`,

	main: html`
		<h1><span>🧰</span> toolbox</h1>
		<h4>centralized collection of essential tools</h4>

		<benev-theater></benev-theater>

		<range-slider
			label="Range slider"
		></range-slider>
	`,
}))

