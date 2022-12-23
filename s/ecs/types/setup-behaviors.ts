
import {Behavior} from "./behavior.js"

export type SetupBehaviors<C extends {}> = (
	(behavior: <A extends keyof C>(b: Behavior<C, A>) => Behavior<C, A>) => Behavior<C, keyof C>[]
)
