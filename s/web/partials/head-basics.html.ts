
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
<script defer type=module-shim>
	import {test} from "cynic"
	import suite from "/tests.test.js"

	// run the test suite
	const {report, ...stats} = await test("example suite", suite)

	// emit the report text to console
	console.log(report)

	// handle results programmatically
	if (stats.failed === 0) console.log("done")
	else console.log("failed!")

	// returns stats about the test run results
	console.log(stats)
</script>
<script
	src="/node_modules/es-module-shims/dist/es-module-shims.wasm.js"
	defer
></script>
`
