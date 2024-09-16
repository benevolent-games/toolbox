
import {nap, signal, Signal} from "@benev/slate"
import {Exhibit, ExhibitFn, LoadingScreen, LoadingState} from "./types.js"

export class Orchestrator {
	static makeExhibit = (exhibit: Exhibit) => exhibit
	static makeExhibitLoader = (fn: ExhibitFn) => fn
	static makeLoadingScreen = (s: LoadingScreen) => s

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
			isLoading: false,
			template: () => undefined,
		})
	}

	get alreadyBusy() {
		if (!!this.loading.value.isLoading) {
			console.warn("orchestrator already busy")
			return true
		}
		return false
	}

	makeNavFn<Fn extends ExhibitFn>(screen: LoadingScreen, exhibitFn: Fn) {
		const setLoadingState = (active: boolean) => {
			this.loading.value = {
				active,
				isLoading: true,
				template: () => screen.render({active: this.loading.value.active}),
			}
		}

		return async(...args: Parameters<Fn>) => {
			if (this.alreadyBusy)
				return

			// initially render loading and flip the active switch
			// to play the intro animation
			setLoadingState(false)

			// yielding multiple loops, to surely defeat debouncers
			await nap(0)
			await nap(0)
			await nap(0)

			setLoadingState(true)

			// load the exhibit, and also wait for animation to be done
			const [exhibit] = await Promise.all([
				exhibitFn(...args),
				nap(this.animTime.value),
			])

			// dispose the previous exhibit
			this.exhibit.value.dispose()

			// display the new exhibit,
			// and disable active switch so loading it can animate the outro
			this.exhibit.value = exhibit
			await nap(this.animTime.value)
			setLoadingState(false)

			// after the outro anim is done, end the loading routine
			await nap(this.animTime.value)
			this.loading.value = {
				active: false,
				isLoading: false,
				template: () => undefined,
			}

			return exhibit
		}
	}
}

