
import {Node} from "@gltf-transform/core"

export const lod_ratios = [1.0, 0.5, 0.25, 0.125, 0.05] as const

export type LOD = Node | undefined

export type LODs = [LOD, LOD, LOD, LOD, LOD]

export type LodGroup = {
	lods: LODs
	directives?: string
}

