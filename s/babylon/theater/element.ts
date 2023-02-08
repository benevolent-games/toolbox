
import {html} from "lit"
import {NubContext} from "@benev/nubs"
import {property, query} from "lit/decorators.js"
import {snapstate} from "@chasemoskal/snapstate"
import {MagicElement, mixinCss, UseElement} from "@chasemoskal/magical"

import {styles} from "./styles.css.js"
import {Profiling} from "./views/profiling.js"
import {NubsButton} from "./views/nubs-button.js"
import {setupListener} from "./utils/setup-listener.js"
import {MobileControls} from "./views/mobile-controls.js"
import {SettingsButton} from "./views/settings-button.js"
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

	@property()
	renderers: Renderer[] = []

	settingsSnap = snapstate(defaultSettings(this.renderers))
	get settings() {
		return this.settingsSnap.writable
	}
	connectedCallback() {
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
		onViewModeChange: () => this.babylon.resize,
	})

	#setShowFramerate = (showFramerate: boolean) => {
		this.settings.framerate = showFramerate
	}

	#setShowProfiling = (showProfiling: boolean) => {
		this.settings.profiling = showProfiling
	}

	realize(use: UseElement<typeof this>) {
		use.setup(setupFullscreenListener(this.settings))
		use.setup(setupListener(window, "resize", this.babylon.resize))

		return html`
			<nub-context default-bindings="
				👼 Cool Default Bindings
				🖱 look :: lookmouse
				🕹️ look :: lookstick
				🕹️ move :: movestick
				*️⃣ forward :: KeyW ArrowUp
				*️⃣ backward :: KeyS ArrowDown
				*️⃣ leftward :: KeyA ArrowLeft
				*️⃣ rightward :: KeyD ArrowRight
				*️⃣ jump :: Space
				*️⃣ use :: KeyF Mouse3
				*️⃣ primary :: Mouse1
				*️⃣ secondary :: Mouse2
				">

				${this.babylon.canvas}

				<nub-visualizer></nub-visualizer>
				<nub-real-keyboard></nub-real-keyboard>
				<nub-real-mouse name=lookmouse></nub-real-mouse>

				${MobileControls()}

				<div class="button_bar">
					${ViewModeButton({
						viewMode: this.settings.viewMode,
						setViewMode: this.#setViewMode,
					})}
					${SettingsButton({
						showFramerate: this.settingState.framerate,
						showProfiling: this.settingState.profiling,
						setShowFramerate: this.#setShowFramerate,
						setShowProfiling: this.#setShowProfiling,
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
