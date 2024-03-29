
import {unicodes} from "./unicodes.js"

export const controls = {
	payloadsep: unicodes.file_separator,
	openarray: unicodes.device_control_1,
	openobject: unicodes.device_control_2,
	close: unicodes.null,
	itemsep: unicodes.record_separator,
	pairsep: unicodes.unit_separator,
}

/*

{DATA}

(openarray)
	(openobject)
		{ID}(pairsep){DATA}
			(itemsep)
		{ID}(pairsep)(openarray)
			{DATA}
				(itemsep)
			{DATA}
		(close)
	(close)
(close)

*/
