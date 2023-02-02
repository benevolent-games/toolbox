
import {html} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

export default ({title, v}: WebsiteContext & {title: string}) => html`

<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="darkreader" content="dark"/>
<title>${title}</title>

<link rel=stylesheet href="${v("/index.css")}"/>

<script
	type=importmap-shim
	src="${v("/importmap.json")}"
	defer
></script>
<script
	type=module-shim
	src="${v("/tests.test.js")}"
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
`
