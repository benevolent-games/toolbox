
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
				<a href="https://benevolent.games/">
					<img class=logo src="https://benevolent.games/assets/benevolent.svg" alt=""/>
				</a>
				<h1><code>@benev/toolbox</code></h1>
				<p>a <a href="https://benevolent.games/">benevolent.games</a> project</p>
			</header>
			<div class=content>
				<p>toolbox helps us make web games. maybe it can help you too.</p>
				<p>it's on <a href="https://github.com/benevolent-games/toolbox">github</a> and <a href="https://www.npmjs.com/package/@benev/toolbox">npm</a>.</p>
				<p>toolbox also hosts some standalone apps:</p>
			</div>
			<ul>
				<li>
					<a href="/dance-studio/">
						<strong>dance-studio</strong>
						<span>character animation gym</span>
					</a>
				</li>
			</ul>
		`,
	})
})

