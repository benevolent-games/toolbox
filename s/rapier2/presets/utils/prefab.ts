
import {Pojo, ob} from "@benev/slate"
import {Physics} from "../../physics.js"

export interface Prefab {
	dispose(): void
}

export type PrefabFn<xParams extends object, xPrefab extends Prefab> = (
	({}: Physics) => ({}: xParams) => xPrefab
)

export function prefab<xParams extends object, xPrefab extends Prefab>(
		fn: PrefabFn<xParams, xPrefab>
	) {
	return fn
}

export function prefab_helpers<P extends Pojo<PrefabFn<any, any>>>(physics: Physics, prefabs: P) {
	return ob(prefabs).map(fn => fn(physics)) as {[K in keyof P]: ReturnType<P[K]>}
}

