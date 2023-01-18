
import {html, HtmlTemplate} from "xiome/x/toolbox/hamster-html/html.js"
import {WebsiteContext} from "xiome/x/toolbox/hamster-html/website/build-website-types.js"

import headBasicsHtml from "./head-basics.html.js"

export default ({
	v, mainContent,
	headContent,
	htmlClass = "",
	...options
}: WebsiteContext & {
	htmlClass?: string
	headContent?: HtmlTemplate
	mainContent?: HtmlTemplate
}) => html`

<!doctype html>
<html class="${htmlClass}">
<head>
	${headBasicsHtml({...options, v, title: "toolbox"})}
	${headContent}
</head>
<body>
	${mainContent}
</body>
`
