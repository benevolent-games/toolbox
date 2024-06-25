
/**
 * create a 3d world in babylonjs.
 *  - handles a bunch of silly boilerplate automatically for you.
 *  - can use webgpu instead of webgl if you allow it.
 *  - switches babylon to use opengl standards instead of directx.
 *  - has handy facilities, for loading glbs, managing cameras, postpro effects, etc.
 */
export class Vista {

	static async create({canvas}: {
			canvas: HTMLCanvasElement | OffscreenCanvas
		}) {
		return new this({canvas})
	}

	readonly canvas: HTMLCanvasElement | OffscreenCanvas

	constructor({canvas}: {
			canvas: HTMLCanvasElement | OffscreenCanvas
		}) {
		this.canvas = canvas
	}

	dispose() {}
}

