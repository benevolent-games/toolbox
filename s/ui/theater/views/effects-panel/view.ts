
import {TemplateResult, html, reactor} from "@benev/slate"

import {styles} from "./styles.js"
import {Meta} from "./parts/meta.js"
import {nexus} from "../../../nexus.js"
import {to} from "../../../../math/vec3.js"
import {NuiColor} from "../../../nui/color.js"
import {NuiRange} from "../../../nui/range.js"
import {Bestorage} from "./parts/bestorage.js"
import {NuiSelect} from "../../../nui/select.js"
import {Stage} from "../../../../stage/stage.js"
import {NuiCheckbox} from "../../../nui/checkbox.js"
import {EffectsStates} from "./parts/effects-states.js"
import {Effects} from "../../../../stage/rendering/effects/types.js"

export type EffectsPanelData = {
	resolution: number
	effects: Partial<Effects>
}

export function defaultEffectsData(): EffectsPanelData {
	return {
		resolution: 100,
		effects: {},
	}
}

export const EffectsPanel = nexus.shadow_view(use => (stage: Stage, bestorage: Bestorage<EffectsPanelData>) => {
	use.name("effects-panel")
	use.styles(styles)

	const states = use.once(() => new EffectsStates(stage))
	const {effects} = states

	use.mount(() => reactor.reaction(() => {
		bestorage.data.effects = states.effectsData
		bestorage.pulse()
	}))

	use.mount(() => reactor.reaction(() => {
		stage.porthole.resolution = bestorage.data.resolution / 100
		stage.rendering.setEffects(bestorage.data.effects)
	}))

	function render_input<G extends Effects[keyof Effects]>(group: G) {
		return (metaGroup: Meta.Group<G>) => {
			const g = group as any
			return Object.entries(metaGroup).map(([key, meta]) => {
				const value = g[key]

				if (meta instanceof Meta.Number)
					return NuiRange([{
						...meta.granularity,
						label: key,
						value,
						set: x => g[key] = x,
					}])

				else if (meta instanceof Meta.Boolean)
					return NuiCheckbox([{
						label: key,
						checked: value,
						set: x => g[key] = x,
					}])

				else if (meta instanceof Meta.SelectString)
					return NuiSelect([{
						label: key,
						options: meta.options,
						selected: g[key],
						set: x => g[key] = x,
					}])

				else if (meta instanceof Meta.Color)
					return NuiColor([{
						label: key,
						initial_hex_color: to.hexcolor(g[key]),
						set: ({color}) => g[key] = color,
					}])

				else throw new Error(`invalid setting "${key}"`)
			})
		}
	}

	function render_section<G extends Effects[keyof Effects]>(
			activeKey: keyof Effects,
			group: G,
			docs?: TemplateResult,
		) {
		return (metaGroup: Meta.Group<G>) => html`
			<article
				data-dynamic
				?data-active="${states.active[activeKey]}">
				<header>
					${NuiCheckbox([{
						label: activeKey,
						checked: states.active[activeKey],
						set: active => states.active[activeKey] = active,
					}])}
					${docs}
				</header>
				<section>
					${render_input(group)(metaGroup)}
				</section>
			</article>
		`
	}

	function handle_json_change(event: InputEvent) {
		const textarea = event.currentTarget as HTMLTextAreaElement
		bestorage.json = textarea.value
	}

	return html`
		<slot></slot>

		<article data-active>
			<header>general</header>
			<section>
				${NuiRange([{
					label: "resolution",
					min: 5, max: 100, step: 5,
					value: bestorage.data.resolution,
					set: x => {
						bestorage.data.resolution = x
						bestorage.pulse()
					},
				}])}
			</section>
		</article>

		<article data-active>
			<header>data</header>
			<textarea
				.value="${bestorage.json}"
				@change="${handle_json_change}"
				spellcheck="off"
				autocorrect="off"
				autocomplete="off"
				autocapitalize="off"
			></textarea>
		</article>

		${render_section("scene", effects.scene, html`
				<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.Scene">ref</a>
			`)({
			clearColor: Meta.color,
			ambientColor: Meta.color,
			environmentIntensity: Meta.granularity.medium,
			shadowsEnabled: Meta.boolean,
			forceShowBoundingBoxes: Meta.boolean,
			forceWireframe: Meta.boolean,
			disableGammaTransform: Meta.boolean,
		})}

		${render_section("fog", effects.fog, html`
				<a target=_blank href="https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction#fog">doc</a>
				<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.Scene#fogColor">ref</a>
			`)({
			mode: new Meta.SelectString<typeof effects.fog.mode>([
				"none",
				"exp",
				"exp2",
				"linear",
			]),
			color: Meta.color,
			start: Meta.granularity.coarser,
			end: Meta.granularity.coarser,
			density: Meta.granularity.superfine,
		})}

		<article data-active>
			<header>
				<span>default rendering</span>
				<a target=_blank href="https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/defaultRenderingPipeline">doc</a>
				<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.DefaultRenderingPipeline">ref</a>
			</header>
			<section>
				<article data-active>
					<header>
						<span>image processing</span>
						<a target=_blank href="https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#imageprocessing">doc</a>
						<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.ImageProcessingPostProcess">ref</a>
					</header>
					<section>
						${render_section("image", effects.image)({
							contrast: Meta.granularity.medium,
							exposure: Meta.granularity.medium,
						})}

						${render_section("tonemapping", effects.tonemapping)({
							operator: new Meta.SelectString<typeof effects.tonemapping.operator>([
								"Hable",
								"HejiDawson",
								"Reinhard",
								"Photographic",
							]),
						})}

						${render_section("vignette", effects.vignette)({
							color: Meta.color,
							weight: Meta.granularity.medium,
							multiply: Meta.boolean,
							stretch: Meta.granularity.coarse,
						})}
					</section>
				</article>

				${render_section("antialiasing", effects.antialiasing)({
					fxaa: Meta.boolean,
					samples: Meta.granularity.samples,
				})}

				${render_section("bloom", effects.bloom)({
					weight: new Meta.Number({min: 0, max: 10, step: .01}),
					threshold: Meta.granularity.fine,
					scale: Meta.granularity.medium,
					kernel: Meta.granularity.bigSamples,
				})}

				${render_section("chromaticAberration", effects.chromaticAberration)({
					aberrationAmount: Meta.granularity.coarse,
					radialIntensity: Meta.granularity.medium,
				})}

				${render_section("glow", effects.glow)({
					intensity: Meta.granularity.medium,
					blurKernelSize: Meta.granularity.samples,
				})}

				${render_section("sharpen", effects.sharpen)({
					colorAmount: Meta.granularity.medium,
					edgeAmount: Meta.granularity.medium,
				})}
			</section>
		</article>

		${render_section("ssao", effects.ssao, html`
				<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.SSAO2RenderingPipeline">ref</a>
			`)({
			bypassBlur: Meta.boolean,
			expensiveBlur: Meta.boolean,
			ssaoRatio: Meta.granularity.medium,
			blurRatio: Meta.granularity.medium,
			totalStrength: Meta.granularity.medium,
			base: Meta.granularity.medium,
			bilateralSamples: Meta.granularity.bigSamples,
			bilateralSoften: Meta.granularity.medium,
			bilateralTolerance: Meta.granularity.medium,
			maxZ: Meta.granularity.giant,
			minZAspect: Meta.granularity.coarse,
			radius: Meta.granularity.medium,
			epsilon: Meta.granularity.fine,
			samples: Meta.granularity.integer,
		})}

		${render_section("ssr", effects.ssr, html`
				<a target=_blank href="https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/SSRRenderingPipeline">doc</a>
				<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.SSRRenderingPipeline">ref</a>
			`)({
			debug: Meta.boolean,
			useFresnel: Meta.boolean,
			clipToFrustum: Meta.boolean,
			attenuateFacingCamera: Meta.boolean,
			attenuateScreenBorders: Meta.boolean,
			enableSmoothReflections: Meta.boolean,
			attenuateBackfaceReflection: Meta.boolean,
			attenuateIntersectionDistance: Meta.boolean,
			attenuateIntersectionIterations: Meta.boolean,
			enableAutomaticThicknessComputation: Meta.boolean,
			backfaceForceDepthWriteTransparentMeshes: Meta.boolean,
			maxDistance: Meta.granularity.giant,
			maxSteps: Meta.granularity.coarser,
			reflectionSpecularFalloffExponent: Meta.granularity.medium,
			roughnessFactor: Meta.granularity.fine,
			strength: Meta.granularity.medium,
			blurDispersionStrength: Meta.granularity.fine,
			reflectivityThreshold: Meta.granularity.superfine,
			blurDownsample: Meta.granularity.medium,
			ssrDownsample: Meta.granularity.medium,
			samples: Meta.granularity.coarse,
			step: Meta.granularity.medium,
			thickness: Meta.granularity.medium,
			selfCollisionNumSkip: Meta.granularity.medium,
			backfaceDepthTextureDownsample: Meta.granularity.medium,
		})}

		${render_section("lens", effects.lens, html`
				<a target=_blank href="https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/dofLenseEffects">doc</a>
				<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.LensRenderingPipeline">ref</a>
			`)({
			ratio: Meta.granularity.fine,
			blur_noise: Meta.boolean,
			dof_pentagon: Meta.boolean,
			chromatic_aberration: Meta.granularity.fine,
			edge_blur: Meta.granularity.fine,
			distortion: Meta.granularity.fine,
			grain_amount: Meta.granularity.fine,
			dof_focus_distance: Meta.granularity.coarse,
			dof_aperture: Meta.granularity.small,
			dof_darken: Meta.granularity.medium,
			dof_gain: Meta.granularity.medium,
			dof_threshold: Meta.granularity.medium,
		})}
	`
})

