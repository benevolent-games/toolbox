
// import {pub} from "@benev/slate"
// import {HostState, JoinerControls, JoinerHandlers} from "sparrow-rtc"

// const magic = Symbol()

// export class Hostcore {
// 	#state: HostState = {session: undefined}
// 	#clients = new Map<string, any>()

// 	get session() {
// 		return Object.freeze(this.#state.session)
// 	}

// 	[magic] = {
// 		setState: (state: HostState) => {
// 			this.#state = state
// 		},
// 		addClientWhoJoined: (client: ConnectedClient) => {
// 			this.#clients.set(client.id, client)
// 		},
// 	}
// }

// export class ConnectedClient {
// 	#controls: JoinerControls
// 	#onClose = pub<void>()
// 	#inbox: any[] = []

// 	constructor(controls: JoinerControls) {
// 		this.#controls = controls
// 	}

// 	get id() { return this.#controls.clientId }
// 	get send() { return this.#controls.send }

// 	close() {
// 		this.#controls.close()
// 		this.#onClose.publish()
// 	}

// 	[magic]: JoinerHandlers = {
// 		handleClose: () => {
// 			this.close()
// 		},
// 		handleMessage: () => {

// 		},
// 	}
// }

// export async function host({label}: {label: string}) {
// 	const hostcore = new Hostcore()
// 	const session = await createSessionAsHost({
// 		label,
// 		rtcConfig: standardRtcConfig,
// 		signalServerUrl: "wss://sparrow-rtc.benevolent.games/",

// 		onStateChange: state => hostcore[magic].setState(state),

// 		handleJoin(joiner) {
// 			const client = new ConnectedClient(joiner)
// 			hostcore[magic].addClientWhoJoined(client)
// 			return {
// 				handleClose() {},
// 				handleMessage() {},
// 			}
// 		},
// 	})
// }

