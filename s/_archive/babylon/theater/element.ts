
import {html} from "lit"
import {NubContext} from "@benev/nubs"
import {snapstate} from "@chasemoskal/snapstate"
import {property, query} from "lit/decorators.js"
import {MagicElement, mixinCss, UseElement} from "@chasemoskal/magical"

import {styles} from "./styles.css.js"
import {Profiling} from "./views/profiling.js"
import {NubsButton} from "./views/nubs-button.js"
import {setupListener} from "./utils/setup-listener.js"
import {MobileControls} from "./views/mobile-controls.js"
import {SettingsButton} from "./views/settings-button.js"
import {resizeObserver} from "./utils/resize-observer.js"
import {viewModeSetter} from "./utils/view-mode-setter.js"
import {ViewModeButton} from "./views/view-mode-button.js"
import {ViewMode} from "./utils/view-selector/view-modes.js"
import {FramerateDisplay} from "./views/frame-rate-display.js"
import {makeBabylonWorld} from "./utils/make-babylon-world.js"
import {defaultSettings, Renderer} from "./utils/default-settings.js"
import {setupFullscreenListener} from "./utils/setup-fullscreen-listener.js"

@mixinCss(styles)
export class BenevTheater extends MagicElement {

	babylon = makeBabylonWorld()

	@property({reflect: true})
	["view-mode"]: ViewMode = "small"

	@property({type: Boolean, reflect: true})
	["pointer-lock"]: boolean = false

	@property({type: Boolean, reflect: true})
	["disable-pointer-lock"]: boolean = false

	@property({type: Boolean, reflect: true})
	["mobile-controls"]: boolean = false

	@property()
	renderers: Renderer[] = []

	settingsSnap = snapstate(defaultSettings(this.renderers))
	get settings() {
		return this.settingsSnap.writable
	}
	connectedCallback() {
		this.settings.viewMode = this["view-mode"]
		super.connectedCallback()
		this.settingsSnap.subscribe(settings => {
			if (this.isConnected) {
				this["view-mode"] = settings.viewMode
				this.requestUpdate()
			}
		})
	}

	@query("nub-context")
	nubContext: NubContext | undefined

	get settingState() {
		return this.settingsSnap.readable
	}

	#setViewMode = viewModeSetter({
		settings: this.settings,
		enterFullscreen: () => this.requestFullscreen(),
	})

	#setShowFramerate = (showFramerate: boolean) => {
		this.settings.framerate = showFramerate
	}

	#setShowProfiling = (showProfiling: boolean) => {
		this.settings.profiling = showProfiling
	}

	#setResolutionScale = (percent: number) => {
		const fraction = percent / 100
		const canvas = this.babylon.canvas
		const {width, height} = canvas.getBoundingClientRect()
		this.settings.resolutionScale = percent
		canvas.width = width * fraction
		canvas.height = height * fraction
	}

	#updatePointerLockAttribute = () => {
		this["pointer-lock"] = !!document.pointerLockElement
	}

	#requestPointerLock = (event: PointerEvent) => {
		this.requestPointerLock()
	}

	realize(use: UseElement<typeof this>) {
		use.setup(setupFullscreenListener(this.settings))
		use.setup(resizeObserver)

		use.setup(
			setupListener(
				document, "pointerlockchange", this.#updatePointerLockAttribute
			)
		)

		const is_pointer_locked = !!document.pointerLockElement

		return html`
			<nub-context>
				${this.babylon.canvas}

				<nub-keyboard ?prevent-default=${is_pointer_locked}></nub-keyboard>
				<nub-pointer></nub-pointer>

				${!this["disable-pointer-lock"]
					? html`
							<div
								class=pointer_lock_area
								@pointerup=${this.#requestPointerLock}
							></div>`
					: null
				}

				${this["mobile-controls"]
					? MobileControls()
					: null}

				<div class="button_bar">
					${ViewModeButton({
						viewMode: this.settings.viewMode,
						setViewMode: this.#setViewMode,
					})}

					${SettingsButton({
						showFramerate: this.settingState.framerate,
						showProfiling: this.settingState.profiling,
						resolutionScale: this.settingState.resolutionScale,
						setShowFramerate: this.#setShowFramerate,
						setShowProfiling: this.#setShowProfiling,
						setResolutionScale: this.#setResolutionScale,
						additionalSettings: this.renderers
					})}

					${NubsButton()}

					${this.settingState.profiling
						? Profiling({
								sceneInstrumentation: this.babylon.sceneInstrumentation,
								engineInstrumentation: this.babylon.engineInstrumentation,
							})
						: null
					}

					${this.settingState.framerate
						? FramerateDisplay({
								getFramerate: () => this.babylon.engine.getFps(),
							})
						: null
					}
				</div>
			</nub-context>
		`
	}
}
