
import {Realm} from "../realm/realm.js"
import {Disposable} from "../../../tools/disposable.js"
// import {Choreographer} from "../../../dance-studio/models/loader/choreographer/choreographer.js"
import {CharacterInstance} from "../../../dance-studio/models/loader/character/character_instance.js"

export class Humanoid extends Disposable {
	#character: CharacterInstance
	// #choreographer: Choreographer

	constructor(realm: Realm) {
		super()

		this.#character = new CharacterInstance(
			realm.containers.character,
			[0, 0, 0],
		)

		// this.#choreographer = new Choreographer(
		// 	this.#character,
		// )

		this.disposable(realm.plate.onTick(() => {
			// this.#choreographer.tick({
			// 	look: [0.2, 0],
			// 	move: [0, 1],
			// })
		}))

		this.disposable(() => this.#character.dispose())
	}
}

