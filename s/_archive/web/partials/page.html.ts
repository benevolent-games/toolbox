
import {template, html, Html} from "@benev/turtle"

export default template<{
		head: Html
		main: Html
	}>(async({path}, {head, main}) => html`

	<!doctype html>
	<html>
		<head>
			<meta charset="utf-8"/>
			<meta name="viewport" content="width=device-width,initial-scale=1"/>
			<meta name="darkreader" content="dark"/>

			<title>@benev/toolbox</title>
			<link rel=stylesheet href="${path(import.meta.url).version.root('index.css')}"/>

			${head}
		</head>
		<body>
			${main}
		</body>
	</html>
`)

