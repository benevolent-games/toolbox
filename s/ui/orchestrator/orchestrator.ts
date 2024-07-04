
import {html, nap, signal, Signal} from "@benev/slate"

import {OrchestratorView} from "./view.js"
import {Exhibit, ExhibitFn, LoadingScreen, LoadingState} from "./types.js"

export class Orchestrator {
	static makeExhibit = (exhibit: Exhibit) => exhibit
	static makeExhibitLoader = (fn: ExhibitFn) => fn
	static makeLoadingScreen = (s: LoadingScreen) => s

	static render(orchestrator: Orchestrator) {
		return OrchestratorView([orchestrator], {
			content: html`

				<div class=loading slot=loading>
					${orchestrator.loading.value.template}
				</div>

				<div class=exhibit>
					${orchestrator.exhibit.value.template}
				</div>
			`,
		})
	}

	animTime: Signal<number>
	exhibit: Signal<Exhibit>
	loading: Signal<LoadingState>

	constructor(o: {
			animTime: number
			startingExhibit: Exhibit
		}) {
		this.animTime = signal(o.animTime)
		this.exhibit = signal(o.startingExhibit)
		this.loading = signal<LoadingState>({
			active: false,
			template: undefined,
		})
	}

	get alreadyBusy() {
		if (!!this.loading.value.template) {
			console.warn("orchestrator already busy")
			return true
		}
		return false
	}

	makeNavFn(screen: LoadingScreen, exhibitFn: ExhibitFn) {
		const rerender = (active: boolean) => {
			this.loading.value = {
				active,
				template: screen.render({active}),
			}
		}

		return async() => {
			if (this.alreadyBusy)
				return

			// initially render loading and flip the active switch
			// to play the intro animation
			rerender(false)
			await nap(0)
			rerender(true)

			// load the exhibit, and also wait for animation to be done
			const [exhibit] = await Promise.all([
				exhibitFn(),
				nap(this.animTime.value),
			])

			// dispose the previous exhibit
			this.exhibit.value.dispose()

			// display the new exhibit,
			// and disable active switch so loading it can animate the outro
			this.exhibit.value = exhibit
			await nap(this.animTime.value)
			rerender(false)

			// after the outro anim is done, end the loading routine
			await nap(this.animTime.value)
			this.loading.value = {
				active: false,
				template: undefined,
			}
		}
	}
}

