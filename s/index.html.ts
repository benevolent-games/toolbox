
import {template, html, easypage, startup_scripts_with_dev_mode} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		css: "index.css",
		title: "@benev/toolbox",
		head: startup_scripts_with_dev_mode(path),
		body: html`
			<header>
				<h1>
					<span>benevolent.games</span>
					<span>—</span>
					<span>"dance studio"</span>
				</h1>
			</header>
			<dance-studio></dance-studio>
		`,
	})
})

