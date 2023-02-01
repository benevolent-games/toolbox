
import {getElements} from "./main.js"
import {registerElements} from "@chasemoskal/magical"
import {makeTheater} from "./babylon/theater/make-theater.js"

registerElements(getElements())

const theater = makeTheater()

document.body.appendChild(theater.element)
theater.start()
