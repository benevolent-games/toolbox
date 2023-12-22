
import {pub} from "@benev/slate"
import {HostState, JoinerControls} from "sparrow-rtc"

export type NetworkSession = NetworkHostSession | NetworkClientSession

export const magic = Symbol()

export class NetworkHostSession {
	#clients = new Map<string, ConnectedClient<any>>()
	#state: HostState = {session: undefined}

	get session() {
		return this.#state.session
	}

	;[magic] = {
		add_client: (controls: JoinerControls) => {
			const client = new ConnectedClient(controls)
			this.#clients.set(client.id, client)
		},

		add_to_inbox: (id: string, message: any) => {
			const client = this.#clients.get(id)
			if (client)
				client.inbox.push(message)
		},

		delete_client: (id: string) => {
			this.#clients.delete(id)
		},
	}
}

export class NetworkClientSession {
	;[magic] = {
		closed(id: string) {},
	}
}

export class ConnectedClient<Datagram> {
	#controls: JoinerControls

	readonly id: string
	readonly inbox: Datagram[] = []
	readonly onClose = pub<void>()

	constructor(controls: JoinerControls) {
		this.#controls = controls
		this.id = controls.clientId
	}
}

