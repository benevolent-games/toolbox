
import {template, html, easypage, startup_scripts_with_dev_mode, default_script_locations} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		css: "iso/index.css",
		title: "iso (@benev/toolbox)",
		head: html`
			<link rel="icon" href="https://benevolent.games/assets/benevolent.svg"/>
			${startup_scripts_with_dev_mode(path, {
				...default_script_locations(),
				script: "iso/main.js",
				script_bundle: "iso/main.bundle.min.js",
			})}
		`,
		body: html`
			<header>
				<a href="https://benevolent.games/">
					<img class=logo src="https://benevolent.games/assets/benevolent.svg" alt=""/>
				</a>
				<h1>
					<a href="/">@benev/toolbox</a>
					<span>—</span>
					<span>"iso"</span>
				</h1>
			</header>
			<benev-iso></benev-iso>
		`,
	})
})

