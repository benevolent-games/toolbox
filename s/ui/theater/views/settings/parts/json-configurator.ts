
import {is, reactor, signal} from "@benev/slate"

export type JsonAllocator<Data> = {
	get: () => Data
	set: (data: Data) => void
}

export type JsonAllocators = Record<string, JsonAllocator<any>>

export type DataFromAllocators<A extends JsonAllocators> = Partial<{
	[K in keyof A]: A[K] extends JsonAllocator<infer Data>
		? Data
		: never
}>

export class JsonConfigurator<A extends JsonAllocators> {
	static allocator = <Data>(a: JsonAllocator<Data>) => a
	#json = signal("{}")
	#error = false

	constructor(public allocators: A) {}

	get json() {
		return this.#json.value
	}

	set json(s: string) {
		this.#json.value = s.trim()
		this.#push_json_to_allocators()
	}

	get data() {
		const collected: Record<string, any> = {}
		for (const [key, allocator] of Object.entries(this.allocators)) {
			const data = allocator.get()
			if (is.defined(data))
				collected[key] = data
		}
		return collected as DataFromAllocators<A>
	}

	get error() {
		return this.#error
	}

	react_to_allocator_changes = () => reactor.reaction(
		() => this.data,
		data => {
			this.#pull_json_from_allocators(data)
		},
	)

	#pull_json_from_allocators(data: DataFromAllocators<A>) {
		this.#json.value = JSON.stringify(data)
		console.log("pull json from allocators")
	}

	#push_json_to_allocators() {
		console.log("push json to allocators")
		const data = this.#parse_json_data()
		for (const [key, value] of Object.entries(data)) {
			if (key in this.allocators)
				this.allocators[key].set(value)
		}
	}

	#parse_json_data(): DataFromAllocators<A> {
		try {
			this.#error = false
			return JSON.parse(this.json)
		}
		catch (error) {
			this.#error = true
			return {}
		}
	}
}

