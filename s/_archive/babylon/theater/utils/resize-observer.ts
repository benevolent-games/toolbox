import {BenevTheater} from "../element.js"

export const resizeObserver = (theater: BenevTheater) => {
	const observer = new ResizeObserver(() => {
		theater.babylon.resize(theater.settingState.resolutionScale)
	})
	observer.observe(theater)
}
