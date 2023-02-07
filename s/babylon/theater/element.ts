
import {html} from "lit"
import {property} from "lit/decorators.js"
import {snapstate} from "@chasemoskal/snapstate"
import {MagicElement, mixinCss, UseElement} from "@chasemoskal/magical"

import {styles} from "./styles.css.js"
import {Profiling} from "./views/profiling.js"
import {setupListener} from "./utils/setup-listener.js"
import {SettingsButton} from "./views/settings-button.js"
import {viewModeSetter} from "./utils/view-mode-setter.js"
import {ViewModeButton} from "./views/view-mode-button.js"
import {defaultSettings, Renderer} from "./utils/default-settings.js"
import {ViewMode} from "./utils/view-selector/view-modes.js"
import {FramerateDisplay} from "./views/frame-rate-display.js"
import {makeBabylonWorld} from "./utils/make-babylon-world.js"
import {setupFullscreenListener} from "./utils/setup-fullscreen-listener.js"
import {NubsButton} from "./views/nubs-button.js"
import {MobileControls} from "./views/mobile-controls.js"

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
				${this.babylon.canvas}
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
		`
	}
}
