
import {NetworkClientSession, NetworkHostSession, magic} from "./session.js"
import {NetworkClientTarget, NetworkHostTarget, NetworkTarget} from "./target.js"
import {createSessionAsHost, joinSessionAsClient, standardRtcConfig} from "sparrow-rtc"

export async function network_connect(target: NetworkTarget) {
	return target.type === "host"
		? connect_as_host(target)
		: connect_as_client(target)
}

////////////
////////////

async function connect_as_host(target: NetworkHostTarget) {
	const {label} = target
	const session = new NetworkHostSession()
	const {state} = await createSessionAsHost({
		label,
		rtcConfig: standardRtcConfig,
		signalServerUrl: "wss://sparrow-rtc.benevolent.games/",
		handleJoin(controls) {
			const {clientId} = controls
			session[magic].add_client(controls)
			return {
				handleClose() {
					session[magic].delete_client(clientId)
				},
				handleMessage(message: any) {
					session[magic].add_to_inbox(clientId, message)
				},
			}
		},
		onStateChange({session}) {
			session!.discoverable
		},
	})
	lol.state.session!.
	return session
}

async function connect_as_client(target: NetworkClientTarget) {
	const {sessionId} = target
	await joinSessionAsClient({
		sessionId,
		rtcConfig: standardRtcConfig,
		signalServerUrl: "wss://sparrow-rtc.benevolent.games/",
		handleJoin(controls) {
			return {
				handleClose() {},
				handleMessage() {},
			}
		},
		onStateChange({clientId, sessionInfo}) {},
	})
	return new NetworkClientSession()
}

