
import {html} from "lit"
import {property} from "lit/decorators.js"
import {snapstate} from "@chasemoskal/snapstate"
import {MagicElement, mixinCss, UseElement} from "@chasemoskal/magical"

import {styles} from "./styles.css.js"
import {ViewMode} from "./types/view-mode.js"
import {Profiling} from "./views/profiling.js"
import {setupListener} from "./utils/setup-listener.js"
import {SettingsButton} from "./views/settings-button.js"
import {viewModeSetter} from "./utils/view-mode-setter.js"
import {ViewModeButton} from "./views/view-mode-button.js"
import {defaultSettings} from "./utils/default-settings.js"
import {FramerateDisplay} from "./views/frame-rate-display.js"
import {makeBabylonWorld} from "./utils/make-babylon-world.js"
import {setupFullscreenListener} from "./utils/setup-fullscreen-listener.js"

@mixinCss(styles)
export class BenevTheater extends MagicElement {

	babylon = makeBabylonWorld()

	@property({reflect: true})
	["view-mode"]: ViewMode = "embed"

	settingsSnap = snapstate(defaultSettings())
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

	#setViewMode = viewModeSetter({
		settings: this.settings,
		enterFullscreen: () => this.requestFullscreen(),
		onViewModeChange: () => this.babylon.resize,
	})

	realize(use: UseElement<typeof this>) {
		use.setup(setupFullscreenListener(this.settings))
		use.setup(setupListener(window, "resize", this.babylon.resize))

		return html`
			${this.babylon.canvas}

			<div class="button_bar">
				${ViewModeButton({
					viewMode: this.settings.viewMode,
					setViewMode: this.#setViewMode,
				})}
				${Profiling({
					sceneInstrumentation: this.babylon.sceneInstrumentation,
					engineInstrumentation: this.babylon.engineInstrumentation,
				})}
				${SettingsButton({})}
				${FramerateDisplay({
					getFramerate: () => this.babylon.engine.getFps(),
				})}
			</div>
		`
	}
}
