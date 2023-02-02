
import {html} from "lit"
import {MagicElement, mixinCss, UseElement} from "@chasemoskal/magical"

import {styles} from "./styles.css.js"
import {property} from "lit/decorators.js"
import {ViewMode} from "./types/view-mode.js"
import {setupListener} from "./utils/setup-listener.js"
import {viewModeSetter} from "./utils/view-mode-setter.js"
import {SettingsButton} from "./views/settings-button.js"
import {ViewModeButton} from "./views/view-mode-button.js"
import {FramerateDisplay} from "./views/frame-rate-display.js"
import {makeBabylonWorld} from "./utils/make-babylon-world.js"
import {setupFullscreenListener} from "./utils/setup-fullscreen-listener.js"

@mixinCss(styles)
export class BenevTheater extends MagicElement {

	babylon = makeBabylonWorld()

	#setViewMode = viewModeSetter({
		theater: this,
		onViewModeChange: () => this.babylon.resize,
	})

	@property({reflect: true})
	["view-mode"]: ViewMode = "embed"

	realize(use: UseElement<typeof this>) {
		use.setup(setupFullscreenListener(this))
		use.setup(setupListener(window, "resize", this.babylon.resize))

		return html`
			${this.babylon.canvas}

			<div class="button_bar">
				${ViewModeButton({
					viewMode: this["view-mode"],
					setViewMode: this.#setViewMode,
				})}
				${SettingsButton({})}
				${FramerateDisplay({
					getFramerate: () => this.babylon.engine.getFps(),
				})}
			</div>
		`
	}
}
