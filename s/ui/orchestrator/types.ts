
import {RenderResult} from "@benev/slate"

export type Exhibit = {
	template: () => RenderResult
	dispose: () => void
}

export type ExhibitFn = (...args: any[]) => Promise<Exhibit>

export type LoadingScreen = {
	render: ({}: {active: boolean}) => RenderResult
}

export type LoadingState = {
	isLoading: boolean
	active: boolean
	template: () => RenderResult
}

