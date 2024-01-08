
import {clone, css, debounce, html, ob, reactor} from "@benev/slate"

import {nexus} from "../../../nexus.js"
import {Effects} from "../../../../stage/types.js"
import {Realm} from "../../../models/realm/realm.js"
import {NuiCheckbox, NuiRange} from "../../../../nui/nui.js"
import {Rendering} from "../../../../stage/parts/rendering.js"

export const Panel = nexus.shadow_view(use => (realm: Realm) => {
	use.name("panel")
	use.styles(css`
		:host {
			display: block;
		}

		.panel {
			user-select: none;
			& > article {
				border-left: 2px solid;
			}
		}

		header {
			font-weight: bold;
			background: #1118;
			padding: 0.2em 0.5em;
			&[data-active] {
				background: #0ac;
				box-shadow: 0.1em 0.2em 0.2em #0004;
				text-shadow: 0.1em 0.1em 0.1em #0008;
				color: white;
			}
		}

		article {
			background: #1114;
			& + article {
				margin-top: 1em;
			}
			& > article {
				padding: 1em;
			}
		}

		[data-hidden] {
			opacity: 0.25;
		}

		section {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5em;
			justify-items: center;
			align-items: center;
			> * {
				font-size: 0.8em;
				flex: 0 0 auto;
				width: 8rem;
				padding: 0.8rem;
				max-width: 100%;
			}
		}
	`)

	const resolution = use.signal(realm.porthole.resolution * 100)
	const std = use.once(() => Rendering.effects.everything())

	const antialiasing = use.flatstate(std.default.antialiasing)
	const bloom = use.flatstate(std.default.bloom)
	const ssao = use.flatstate(std.ssao)
	const ssr = use.flatstate(std.ssr)

	const active = use.flatstate({
		default: false,
		antialiasing: false,
		bloom: false,
		ssao: false,
		ssr: false,
	})

	const apply_effects = use.once(() => debounce(500, (effects: Effects) => {
		if (!active.antialiasing)
			effects.default!.antialiasing = null

		if (!active.bloom)
			effects.default!.bloom = null

		if (!active.default)
			effects.default = null

		if (!active.ssao)
			effects.ssao = null

		if (!active.ssr)
			effects.ssr = null

		realm.stage.rendering.setEffects(effects)
	}))

	use.mount(() => reactor.reaction(
		() => clone({active, effects: {default: {antialiasing, bloom}, ssao, ssr}}),
		({effects}) => apply_effects(effects)),
	)

	use.mount(() => reactor.reaction(
		() => realm.porthole.resolution = resolution.value / 100)
	)

	return html`
		<div class=panel>
			<article>
				<header>settings</header>
				<section>
					${NuiRange([{
						label: "resolution",
						min: 5, max: 100, step: 5,
						value: resolution.value,
						set: x => resolution.value = x,
					}])}
				</section>
			</article>

			<article>
				<header ?data-active="${active.default}">
					${NuiCheckbox([{
						label: "core",
						checked: active.default,
						set: x => active.default = x,
					}])}
				</header>
				<article ?data-hidden="${!active.default}">
					<header ?data-active="${active.antialiasing}">
						${NuiCheckbox([{
							label: "antialiasing",
							checked: active.antialiasing,
							set: x => active.antialiasing = x,
						}])}
					</header>
					<section class=group ?data-hidden="${!active.antialiasing}">
						${NuiRange([{
							label: "samples",
							min: 2, max: 16, step: 2,
							value: antialiasing.samples,
							set: x => antialiasing.samples = x,
						}])}
						${NuiCheckbox([{
							label: "fxaa",
							checked: antialiasing.fxaa,
							set: x => antialiasing.fxaa = x,
						}])}
					</section>

					<header ?data-active="${active.bloom}">
						${NuiCheckbox([{
							label: "bloom",
							checked: active.bloom,
							set: x => active.bloom = x,
						}])}
					</header>
					<section ?data-hidden="${!active.bloom}">
						${NuiRange([{
							label: "weight",
							min: 0, max: 2, step: .1,
							value: bloom.weight,
							set: x => bloom.weight = x,
						}])}
						${NuiRange([{
							label: "threshold",
							min: 0, max: 1, step: .01,
							value: bloom.threshold,
							set: x => bloom.threshold = x,
						}])}
						${NuiRange([{
							label: "scale",
							min: 0, max: 3, step: .1,
							value: bloom.scale,
							set: x => bloom.scale = x,
						}])}
						${NuiRange([{
							label: "kernel",
							min: 8, max: 256, step: 8,
							value: bloom.kernel,
							set: x => bloom.kernel = x,
						}])}
					</section>
				</article>
			</article>

			<article>
				<header ?data-active="${active.ssao}">
					${NuiCheckbox([{
						label: "ssao",
						checked: active.ssao,
						set: x => active.ssao = x,
					}])}
				</header>
				<section ?data-hidden="${!active.ssao}">
					${NuiRange([{
						label: "ratio",
						min: 0, max: 3, step: .1,
						value: ssao.ratio,
						set: x => ssao.ratio = x,
					}])}
					${NuiRange([{
						label: "blur",
						min: 0, max: 3, step: .1,
						value: ssao.blur,
						set: x => ssao.blur = x,
					}])}
					${NuiRange([{
						label: "strength",
						min: 0, max: 5, step: .1,
						value: ssao.strength,
						set: x => ssao.strength = x,
					}])}
					${NuiRange([{
						label: "radius",
						min: 0, max: 5, step: .1,
						value: ssao.radius,
						set: x => ssao.radius = x,
					}])}
				</section>
			</article>

			<article>
				<header ?data-active="${active.ssr}">
					${NuiCheckbox([{
						label: "ssr",
						checked: active.ssr,
						set: x => active.ssr = x,
					}])}
				</header>
				<section ?data-hidden="${!active.ssr}">
					${NuiRange([{
						label: "strength",
						min: 0, max: 3, step: .1,
						value: ssr.strength,
						set: x => ssr.strength = x,
					}])}
					${NuiRange([{
						label: "blur",
						min: 0, max: 3, step: .1,
						value: ssr.blur,
						set: x => ssr.blur = x,
					}])}
					${NuiCheckbox([{
						label: "fresnel",
						checked: ssr.fresnel,
						set: x => ssr.fresnel = x,
					}])}
					${NuiRange([{
						label: "threshold",
						min: 0, max: .1, step: .001,
						value: ssr.threshold,
						set: x => ssr.threshold = x,
					}])}
					${NuiRange([{
						label: "falloff",
						min: 0, max: 5, step: .1,
						value: ssr.falloff,
						set: x => ssr.falloff = x,
					}])}
					${NuiRange([{
						label: "downsample",
						min: 0, max: 5, step: .1,
						value: ssr.downsample,
						set: x => ssr.downsample = x,
					}])}
				</section>
			</article>
		</div>
	`
})

