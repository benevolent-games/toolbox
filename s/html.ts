
import {registerElements} from "@chasemoskal/magical"
import {makeTheater} from "./babylon/theater/make-theater.js"
import {getElements} from "./main.js"

registerElements(getElements())

const theater = makeTheater()
document.body.appendChild(theater.element)
theater.start()
