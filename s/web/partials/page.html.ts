
import {webpage, html, HtmlTemplate} from "@benev/turtle"

export default webpage<{
		head: HtmlTemplate
		main: HtmlTemplate
	}>(async({v}, {head, main}) => html`

	<!doctype html>
	<html>
		<head>
			<meta charset="utf-8"/>
			<meta name="viewport" content="width=device-width,initial-scale=1"/>
			<meta name="darkreader" content="dark"/>

			<title>@benev/toolbox</title>
			<link rel=stylesheet href="${v("/index.css")}"/>

			${head}
		</head>
		<body>
			${main}
		</body>
	</html>
`)

