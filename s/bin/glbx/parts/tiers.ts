
import sharp from "sharp"
import {Transform} from "@gltf-transform/core"
import {textureCompress} from "@gltf-transform/functions"

import {delete_meshes} from "./transforms/delete_meshes.js"
import {std_transforms} from "./transforms/std_transforms.js"
import {delete_all_normal_maps} from "./transforms/delete_all_normal_maps.js"

export const tiers = {
	fancy: [
		textureCompress({
			encoder: sharp,
			targetFormat: "webp",
			resize: [1024, 1024],
			quality: 90,
		}),
		...std_transforms,
	],
	mid: [
		textureCompress({
			encoder: sharp,
			targetFormat: "webp",
			resize: [512, 512],
			quality: 90,
		}),
		delete_meshes("#0"),
		...std_transforms,
	],
	potato: [
		textureCompress({
			encoder: sharp,
			targetFormat: "webp",
			resize: [128, 128],
			quality: 90,
		}),
		delete_meshes("#0", "#1"),
		delete_all_normal_maps(),
		...std_transforms,
	],
} satisfies Record<string, Transform[]>

