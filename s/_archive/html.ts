
import {registerElements} from "@chasemoskal/magical"

import {installNubs} from "./utils/install-nubs.js"
import {getElements as theaterElements} from "./babylon/theater/get-elements.js"

installNubs()
registerElements(theaterElements())
