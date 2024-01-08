
import {clone, css, debounce, html, reactor} from "@benev/slate"

import {nexus} from "../../../nexus.js"
import {NuiCheckbox, NuiRange} from "../../../../nui/nui.js"
import {Effects} from "../../../../stage/types.js"
import {Realm} from "../../../models/realm/realm.js"
import {Rendering} from "../../../../stage/parts/rendering.js"

export const Panel = nexus.shadow_view(use => (realm: Realm) => {
	use.name("panel")
	use.styles(css`
		:host > * {
			display: block;
			user-select: none;
			& + header { margin-top: 1em; }
		}

		.header {
			font-weight: bold;
			background: #0002;
			padding: 0.2em 0.5em;
		}

		.group {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5em;
			padding-left: 0.5em;

			&[data-hidden] {
				opacity: 0.25;
			}

			> * {
				font-size: 0.6em;
				flex: 0 0 auto;
				width: 14em;
				padding: 1em;
				max-width: 100%;
			}
		}
	`)

	const defaults = use.once(() => Rendering.effects.everything())

	const resolution = use.signal(realm.porthole.resolution * 100)

	const effects = {
		bloom: use.flatstate(defaults.bloom),
		ssao: use.flatstate(defaults.ssao),
		ssr: use.flatstate(defaults.ssr),
	}

	const active = use.flatstate<{[P in keyof Effects]: boolean}>({
		bloom: false,
		ssao: false,
		ssr: false,
	})

	const apply_effects = use.once(() => debounce(500, () => {
		const finalEffects = clone(effects) as Effects
		for (const [key, enabled] of Object.entries(active)) {
			if (!enabled)
				finalEffects[key as keyof Effects] = null
		}
		realm.stage.rendering.setEffects(finalEffects)
		realm.porthole.resolution = resolution.value / 100
	}))

	use.mount(() => reactor.reaction(
		() => clone({effects, active, resolution: resolution.value}),
		() => apply_effects()),
	)

	return html`
		<div class=header>settings</div>

		<div class=group>
			${NuiRange([{
				label: "resolution",
				min: 5, max: 100, step: 5,
				value: resolution.value,
				set: x => resolution.value = x,
			}])}
		</div>

		<div class=header>
			${NuiCheckbox([{
				label: "bloom",
				checked: active.bloom,
				set: x => active.bloom = x,
			}])}
		</div>

		<div class=group ?data-hidden="${!active.bloom}">
			${NuiRange([{
				label: "threshold",
				min: 0, max: 1, step: .01,
				value: effects.bloom.threshold,
				set: x => effects.bloom.threshold = x,
			}])}
			${NuiRange([{
				label: "scale",
				min: .1, max: 3, step: .1,
				value: effects.bloom.scale,
				set: x => effects.bloom.scale = x,
			}])}
			${NuiRange([{
				label: "kernel",
				min: 8, max: 256, step: 8,
				value: effects.bloom.kernel,
				set: x => effects.bloom.kernel = x,
			}])}
		</div>
	`
})

