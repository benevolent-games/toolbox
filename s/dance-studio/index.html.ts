
import {template, html, easypage, startup_scripts_with_dev_mode, default_script_locations} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		css: "dance-studio/index.css",
		title: "dance-studio (@benev/toolbox)",
		head: startup_scripts_with_dev_mode(path, {
			...default_script_locations(),
			script: "dance-studio/main.js",
			script_bundle: "dance-studio/main.bundle.min.js",
		}),
		body: html`
			<header>
				<a href="https://benevolent.games/">
					<img class=logo src="https://benevolent.games/assets/benevolent.svg" alt=""/>
				</a>
				<h1>
					<span>"dance-studio"</span>
					<span>—</span>
					<a href="/">@benev/toolbox</a>
				</h1>
			</header>
			<dance-studio></dance-studio>
		`,
	})
})

