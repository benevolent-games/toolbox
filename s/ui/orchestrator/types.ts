
import {RenderResult} from "@benev/slate"

export type Exhibit = {
	template: RenderResult
	dispose: () => void
}

export type ExhibitFn = () => Promise<Exhibit>

export type LoadingScreen = {
	render: ({}: {active: boolean}) => RenderResult
}

export type LoadingState = {
	active: boolean
	template: RenderResult
}

