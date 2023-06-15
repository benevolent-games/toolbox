
import {template, html} from "@benev/turtle"
import pageHtml from "./partials/page.html.js"

const {url} = import.meta

export default template(basics => pageHtml(basics, {

	head: html`
		<script
			type=importmap-shim
			src="${basics.path(url).version.root('importmap.json')}"
			defer
		></script>
		<script
			type=module-shim
			src="${basics.path(url).version.root('html.js')}"
			defer
		></script>
		<script
			type=module-shim
			src="${basics.path(url).version.root('demo.js')}"
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

